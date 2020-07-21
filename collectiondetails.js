
var siteurl = "";
var securedrl = window.location.href.toLowerCase();
var origin = window.location.hostname.toLowerCase();
var pathname = window.location.pathname.split('/')[1];

if (securedrl.indexOf("https://") == 0) {

    siteurl = "https://" + origin + "/";
    securedrl = "https://" + origin + "/";
}
else if (origin === 'localhost') {
    siteurl = "http://" + securedrl.split('/')[2] + "/" + pathname + "/";
    securedrl = "http://" + securedrl.split('/')[2] + "/" + pathname + "/";
} else if (securedrl.indexOf("https://") == 0) {
    siteurl = "https://" + origin + "/";
    securedrl = "https://" + origin + "/";
}






$(document).ready(function () {

    var CollectionList = [];
    $('#btnAddCollection').on('click', function () {
        debugger;
        var collection = $('#drpcollectionforprice').val();
        var minprice = $('#txtminprice').val();
        var maxprice = $('#txtmaxprice').val();


        if (minprice == '' || minprice == 'undefined' && maxprice == '' || maxprice == 'undefined' && collection == '' || collection == 'undefined' || collection == undefined) {
            alert('Please select collection ,min price,max price First.');
        }
        else {
            $('#tbldisplay').show();

            var isExist = false;

            $.each(CollectionList, function (i, value) {

                if (value.ColletionName === collection) {
                    isExist = true;

                }
                else {
                    isExist = false;
                }

            });

            if (isExist) {
                alert("Already Exist.")
            }
            else {
                var row = "<tr id='" + collection + "'><td>" + collection + "</td> <td>" + minprice + "</td> <td>" + maxprice + "</td> </tr>";
                $('#tbldisplay>tbody').append(row);

                var collDto = { ColletionName: collection, MinPrice: minprice, MaxPrice: maxprice };
                CollectionList.push(collDto);

                $('#drpcollectionforprice').val('0');
                $('#txtminprice').val('')
                $('#txtmaxprice').val('')
            }
        }
    });

    $('#submitCollection').on('click', function () {
        validdation();

    })

    function clearAll() {
        $('#tbldisplay>tbody').empty();
        $('#tbldisplay').hide();
        $('#drpclients').val('0')

        $('#drpcollectionforprice').val('0');
        $('#txtminprice').val('')
        $('#txtmaxprice').val('')

    }
    function AddCollection() {
        var clid = $('#drpclients').val();
        //console.log(CollectionList);

        if (CollectionList.length > 0) {
            debugger;

            var model = JSON.stringify(CollectionList)

            $.ajax({
                type: "POST",
                url: siteurl + "AddClientCollectionWisePrice.aspx/DataBindingCollection",

                contentType: "application/json;charset=utf-8",


                data: JSON.stringify(
             {

                 data1: model, clientid: clid
             }),
                dataType: "json",
                success: function (msg) {

                    if (msg.d == "Success") {
                        alert('Client Collection Wise Price Added Successfully.')
                        clearAll();
                        window.location.href=siteurl + "AddClientCollectionWisePrice.aspx";
                       
                    }
                    else {
                        alert("Something went wrong");
                    }

                },
                error: function (xmlhttprequest, textstatus, errorthrown) {

                }


            });



            //$.post(siteurl + "/Addusers.aspx/DataBindingCollection", model, function (data) {

            //});
        }

    }


    function validdation() {

        //var 


        var txtminprice = $('#txtminprice').val();
        var txtmaxprice = $('#txtmaxprice').val();

        var drpclients = $('#drpclients');
        var drpcollectionforprice = $('#drpcollectionforprice');


        if ($("#drpclients option:selected").val() == '' || $("#drpclients option:selected").val() == 'undefined' || $("#drpclients option:selected").val() == '0') {

            $("#drpclients").parent('.ctrl').find('div').html('<span class="invalid-feedback js-error">Please select Client.</div>');


            $("#drpclients").focus(); //The focus function will move the cursor to "fullname" field
            return false;
        }


            //if ($("#drpcollectionforprice option:selected").val() == '' || $("#drpcollectionforprice option:selected").val() == 'undefined' || $("#drpcollectionforprice option:selected").val() == '0') {

            //    $("#drpcollectionforprice").parent('.ctrl').find('div').html('<span class="invalid-feedback js-error">Please select Collection.</div>');


            //    $("#drpcollectionforprice").focus(); //The focus function will move the cursor to "fullname" field
            //    return false;
            //}

            //    //Blank field validation of fullname, mobile no and address. The function will generate an alert message if "fullname" or "mobile no" or "address" field is blank  
            //else if (txtminprice == '' || txtminprice == 'undefined') {

            //    $("#txtminprice").parent('.ctrl').find('div').html('<span class="invalid-feedback js-error">Min Price is required </span>');

            //    $('#txtminprice').focus(); //The focus function will move the cursor to "fullname" field
            //    return false;
            //    $('#txtminprice').rules('add', {
            //        required: true   // set a new rule
            //    });

            //    //$('#txtcompanyname').rules('remove', 'required');
            //}
            //else if (txtmaxprice == '' || txtmaxprice == 'undefined') {

            //    $("#txtmaxprice").parent('.ctrl').find('div').html('<span class="invalid-feedback js-error">Max Price is required</div>');

            //    //$("#txtgstno").after('<div class="invalid-feedback js-error">GSTIN is required</div>');

            //    $("#txtmaxprice").focus(); //The focus function will move the cursor to "fullname" field
            //    return false;
            //}
        else {

            if (drpclients != '') {
                $("div > div > .js-error").hide()
            }
            AddCollection();
        }
    }

});
