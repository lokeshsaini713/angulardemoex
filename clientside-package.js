

(function ($) {
    'use strict';

    function CountryIndex() {
        var $this = this, grid, formAddEdit;




        function SendLinkToManager(sendlinkId, reff) {
            $.ajax({
                type: "POST",
                url: domain + "admin/saller/sendLinkToManager",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(
                    {

                        SendLinkId: sendlinkId,
                    }),
                dataType: "json",
                success: function (msg) {

                    if (msg == "Success") {

                        //reff.attr('data-sendlinkid', '');
                        //reff.attr('class','btn btn-success');
                        //reff.text('Requested');
                        //reff.attr('title', 'Requested to My Manager');
                        //reff.parent('td').find('a').append(" <i class='fa fa-check fa-lg' style='color:white'></i>");

                        alertify.success('Request sent sucessfully to your Manager.');
                        window.location.href = window.location.href;
                    }
                    else {
                        alertify.error("Fail to Send Request.");
                    }

                },
                error: function (xmlhttprequest, textstatus, errorthrown) {
                    alertify.error(textstatus);
                }


            });
        }


        $('.sendlinkBysaller').on("click", function () {
            var reff = $(this);
            var sendLinkId = $(this).attr('data-sendlinkid');


            if (sendLinkId != "") {
                SendLinkToManager(sendLinkId, reff);
            }
            else {

            }

        })

        function initializeGrid() {


            var isRequestsList = $('#isRequestAvailable').val();
            if (isRequestsList == 'true') {

                $('#grd-packagelist').DataTable({
                    order: [[0, 'desc']],
                    "aoColumnDefs": [
                    { "bSortable": false, "aTargets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                    ],
                    "searching": false,


                });

                $('#grd-requestedLinks').DataTable({
                    order: [[0, 'desc']],
                    "aoColumnDefs": [
                       { "bSortable": false, "aTargets": [3, 4, 5, 6, 7, 8, 9] },

                    ]
                });



            }

        }



        function initializeModalWithForm() {
            $("#modal-choose-package").on('loaded.bs.modal', function () {
                setRowColor();
                formAddEdit = new Global.FormHelper($("#frm-choose-package form"), { updateTargetId: "validation-summary", validateSettings: { ignore: '' } });
                return formAddEdit;
            }).on('hidden.bs.modal', function () {
                $(this).removeData('bs.modal');
            });

        }

        function setRowColor() {
            $('#headingRate').hide();
            $('#SubcatpackageId').change(function () {
                var id = $(this).val();
                setPackageRate(id);

                $('#grid_choose_package>tbody').find('tr').css('background', '');
                $('#grid_choose_package>tbody').find('tr').css('color', '');

                $('#grid_choose_package>tbody').find('#' + id).css('background', '#605CA8');
                $('#grid_choose_package>tbody').find('#' + id).css('color', '#ffffff');


            })
        }


        function setPackageRate(id) {
            if (id == "") {
                $('#divPackageDetails').hide();
            }
            else {
                var gstAmount = 0;
                $('#divPackageDetails').show();
                var rate = parseFloat($('#grid_choose_package>tbody').find('#' + id + ' td.rate').text());
                var gst = parseFloat($('#grid_choose_package>tbody').find('#' + id + ' #GST').val());

                if (gst > 0) {
                    var gstAmount = (rate * gst) / 100;
                }
                else {
                    var gstAmount = rate
                }
                var total = rate + gstAmount;

                $('#span_Amount').text("Amount : " + rate.toFixed(2));
                $('#span_gst').text("GST: " + gst.toFixed(2) + "%");
                $('#span_Total').text("Total : " + total.toFixed(2));
            }
        }

        $this.init = function () {
            initializeModalWithForm();
            initializeGrid();
        };
    }
    $(function () {
        var self = new CountryIndex();
        self.init();
    });

}(jQuery));