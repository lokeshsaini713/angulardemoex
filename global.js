/*global window, $*/
var Global = {
    DomainName: "",
    DataServer: {
        multisearch: [],
        dataURL: ""
    },
    FilterType: {
        Contains: 0,
        Equals: 1,
        StartsWith: 2,
        LessThanOrEqual: 3,
        GreaterThanOrEqual: 4
    },
    Filter: {
        text: "",
        value: ""
    },
    MessageType: {
        Success: 0,
        Error: 1,
        Warning: 2,
        Info: 3
    }
};
Global.FormHelper = function (formElement, options, onSucccess, onError, loadingElementId) {
    "use strict";
    var settings = {};
    settings = $.extend({}, settings, options);
    formElement.validate(settings.validateSettings);
    formElement.submit(function (e) {
        var submitBtn = formElement.find(':submit');
        if (formElement.validate().valid()) {
            submitBtn.find('i').removeClass("fa fa-arrow-circle-right");
            submitBtn.find('i').addClass("fa fa-refresh");
            submitBtn.prop('disabled', true);
            submitBtn.find('span').html('Submiting..');
            $.ajax(formElement.attr("action"), {
                type: "POST",
                data: formElement.serializeArray(),
                beforeSend: function () {
                    if (settings.loadingElementId != null || settings.loadingElementId != undefined) {
                        $("#" + settings.loadingElementId).show();
                        submitBtn.hide();
                    }
                },
                success: function (result) {
                    if (onSucccess === null || onSucccess === undefined) {
                        if (result.isSuccess) {
                            window.location.href = result.redirectUrl;
                            var index = window.location.href.indexOf("#tab");
                          //  console.log(window.location.href);
                            if (index > 0) {
                                window.location.reload();
                            }

                        } else {

                            if (settings.updateTargetId) {
                                $("#" + settings.updateTargetId).html(result);
                            }
                        }
                    } else {
                        onSucccess(result);
                    }
                },
                error: function (jqXHR, status, error) {
                    if (onError !== null && onError !== undefined) {
                        onError(jqXHR, status, error);
                    }
                },
                complete: function () {
                    if (settings.loadingElementId != null || settings.loadingElementId != undefined) {
                        $("#" + settings.loadingElementId).hide();
                    }
                    submitBtn.find('i').removeClass("fa fa-refresh");
                    submitBtn.find('i').addClass("fa fa-arrow-circle-right");
                    submitBtn.find('span').html('Submit');
                    submitBtn.prop('disabled', false);
                }
            });
        }

        e.preventDefault();
    });

    return formElement;
};

Global.GridHelper = function (gridElement, options) {
    if ($(gridElement).find("thead tr th").length > 1) {
        var settings = {};
        settings = $.extend({}, settings, options);
        $(gridElement).dataTable(settings);
        return $(gridElement);
    }
};

Global.GridAjaxHelper = function (gridElement, options, serviceUrl, callback) {
    //console.log(serviceUrl);
  //  console.log(domain + serviceUrl);

    var surl = domain + "admin/" + serviceUrl;
    if ($(gridElement).find("thead tr th").length >= 1) {
        var settings = {
            "processing": true,
            "serverSide": true,
            "ajax": surl,
            "bLengthChange": true,
            "fnServerData": function (sSource, aoData, fnCallback) {
                var aoDataServer = {
                    start: 0,
                    draw: 0,
                    length: 0,
                    columns: [],
                    order: [],
                    search: {
                        regex: false,
                        value: ""
                    },
                    multisearch: []
                };

                for (var i = 0; i < aoData.length; i++) {
                    if (aoData[i].name == "start") {
                        aoDataServer.start = aoData[i].value;
                    } else if (aoData[i].name == "draw") {
                        aoDataServer.draw = aoData[i].value;
                    } else if (aoData[i].name == "length") {
                        aoDataServer.length = aoData[i].value;
                    } else if (aoData[i].name == "order") {
                        for (var j = 0; j < aoData[i].value.length; j++) {
                            aoDataServer.order.push({
                                column: aoData[i].value[j].column,
                                dir: aoData[i].value[j].dir
                            });
                        }
                    } else if (aoData[i].name == "search") {
                        aoDataServer.search.regex = aoData[i].value.regex;
                        aoDataServer.search.value = aoData[i].value.value;
                    } else if (aoData[i].name == "columns") {
                        for (var j = 0; j < aoData[i].value.length; j++) {
                            aoDataServer.columns.push({
                                data: aoData[i].value[j].data,
                                name: aoData[i].value[j].name,
                                orderable: aoData[i].value[j].orderable,
                                search: { regex: aoData[i].value[j].search.regex, value: aoData[i].value[j].search.value },
                                searchable: aoData[i].value[j].searchable
                            });
                        }
                    }
                }

                if (Global.DataServer != null && Global.DataServer.multisearch != null && Global.DataServer.dataURL == serviceUrl) {
                    aoDataServer.multisearch = Global.DataServer.multisearch;
                }

                if (Global.Filter != null) {
                    aoDataServer.filter = Global.Filter;
                }

                $.ajax({
                    "dataType": 'json',
                    "contentType": "application/json; charset=utf-8",
                    "type": "POST",
                    "cache": false,
                    "url": surl,
                    "data": JSON.stringify(aoDataServer),
                    "success": function (result) {
                        fnCallback(result);
                    },
                    error: function (xhr, textStatus, error) {
                        if (typeof console == "object") {
                            console.log(xhr.status + "," + xhr.responseText + "," + textStatus + "," + error);
                        }
                    }
                });
            },
            fnDrawCallback: function (oSettings) {
                if (callback)
                    callback();
            }
        };
        settings = $.extend({}, settings, options);
        return $(gridElement).dataTable(settings);
    }
};

Global.FormValidationReset = function (formElement, validateOption) {
    if ($(formElement).data('validator')) {
        $(formElement).data('validator', null);
    }

    $(formElement).validate(validateOption);

    return $(formElement);
};

Global.DropDownHelper = function (selectElement, options, callBack) {
    var settings = {};
    settings = $.extend({}, settings, options);
    $(selectElement).empty();
    var optionHtml = '';
    if (settings.optionalLabel) {
        optionHtml = '<option value="">' + settings.optionalLabel + '</option>';
    }
    $.get(settings.url, settings.data, function (result) {
        $.each(result, function (index, item) {
            optionHtml += '<option value="' + item[settings.dataValueField] + '">' + item[settings.dataTextField] + '</option>';
        });

        $(selectElement).html(optionHtml);
        if (callBack) { callBack(); }
    });
}

Global.GridHelper = function (gridElement, options) {
    if ($(gridElement).find("thead tr th").length > 1 || options.serverSide === true) {
        var settings = {};
        settings = $.extend({}, settings, options);
        return $(gridElement).dataTable(settings);
    }
};
Global.Alert = function (title, message, callback) {
    alert(title, message, function () {
        if (callback)
            callback();
    });
};







