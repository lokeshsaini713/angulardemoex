(function ($) {
    'use strict';

    function CountryIndex() {
        var $this = this, grid, formAddEdit;


        function initGridControlsWithEvents() {
            $('.switchBox').each(function (index, element) {
                if ($(element).data('bootstrapSwitch')) {
                    $(element).off('switch-change');
                    $(element).bootstrapSwitch('destroy');
                }
                $(element).bootstrapSwitch()
                .on('switch-change', function () {
                    var switchElement = this;
                    $.get(domain + 'post/active', { id: this.value }, function (result) {
                        if (!result) {
                            $(switchElement).bootstrapSwitch('toggleState', true);
                            alertify.error('Error occured.');
                        }
                    });
                });
            });
        }

       

        function initializeGrid() {
            var grid = new Global.GridAjaxHelper('#sample_1', {
                order: [[0, 'desc']],
                "aoColumns": [
               { "rowId": "Id" },
                  {
                      "sName": "Name", "mRender": function (data, type, row) {
                          return data;

                      }
                  },
                 
                    {
                        "sName": "IsActive", "mRender": function (data, type, row) {
                            if (type === 'display') {
                                if (data) {
                                    return '<input type="checkbox" checked="checked" class="switchBox switch-small simple" value="' + row[4] + '" />';
                                }
                                else {
                                    return '<input type="checkbox" class="switchBox switch-small simple" value="' + row[4] + '" />';
                                }
                            }
                            return data;
                        }
                    }
                ],
                "aoColumnDefs": [
                    { 'bSortable': false, 'aTargets': [0,1] },
                    { 'visible': false, 'aTargets': [4] }
                ],
                filter: true,
                // searching:false, //if we want to hide search
            }, "post/getPosts", function () {
                 initGridControlsWithEvents();
            });
        }

        function InitializeCheckboxes() {
            $('.icheck input[type="checkbox"]').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%'
            });
        }

        function initializeModalWithForm() {
            $("#modal-create-edit-post").on('loaded.bs.modal', function () {
                //InitializeCheckboxes();
                formAddEdit = new Global.FormHelper($("#frm-create-edit-post form"), { updateTargetId: "validation-summary", validateSettings: { ignore: '' } });
                return formAddEdit;
            }).on('hidden.bs.modal', function () {
                $(this).removeData('bs.modal');
            });
            $("#modal-delete-post").on('hidden.bs.modal', function () {
                $(this).removeData('bs.modal');
            });
        }

        $this.init = function () {
            initializeGrid();
            initializeModalWithForm();
           
        };
    }
    $(function () {
        var self = new CountryIndex();
        self.init();
    });

}(jQuery));