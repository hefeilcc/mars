g_web_module.person = {
    module_html: ' \
        <div class="row"> \
            <div class="col-md-12"> \
                <form class="form-inline"> \
                    <span>年龄：</span> \
                    <input id="id_edit_age" class="form-control" type="text" placeholder="取值0-100，默认随机"> \
                    &nbsp;&nbsp; \
                    <button id="id_button_create" class="btn btn-primary" type="button">创建</button> \
                    &nbsp;&nbsp; \
                    <button id="id_button_delete" class="btn btn-danger" type="button">删除</button> \
                </form> \
            </div> \
        </div> \
        <div class="row" style="margin-top:20px;"> \
            <div class="col-md-12"> \
                <table id="id_table" class="table table-bordered table-hover table-striped"> \
                </table> \
            </div> \
        </div> \
        ',

    person_dialog: ' \
        <div id="id_person_dialog" class="modal dialog_base" style="width:420px;height:230px" tabindex="-1"> \
            <div class="dialog_header"> \
                <span id="id_dialog_title"></span> \
                <button id="id_button_close" class="button_x" type="button">&times;</button> \
            </div> \
            <div class="dialog_body"> \
                <div class="row content_center" style="margin:5px"> \
                    <div class="col-md-4 pull-right"> \
                        <span>身份证号码：</span> \
                    </div> \
                    <div class="col-md-8 pull-left"> \
                        <input id="id_edit_no" class="form-control" type="text" readonly="readonly"> \
                    </div> \
                </div> \
                <div class="row content_center" style="margin:5px"> \
                    <div class="col-md-4"> \
                        <span>手机号码：</span> \
                    </div> \
                    <div class="col-md-8"> \
                        <input id="id_edit_phone" class="form-control" type="text"> \
                    </div> \
                </div> \
            </div> \
            <div class="dialog_footer"> \
                <button id="id_button_cancel" class="btn btn-secondary btn-sm" type="button">取消</button> \
                &nbsp;&nbsp; \
                <button id="id_button_ok" class="btn btn-primary btn-sm" type="button">确定</button> \
            </div> \
        </div> \
        ',

    init: function() {
        var that = this;

        $("#id_button_create").click(function() {
            that.create_person();
        });

        $("#id_button_delete").click(function() {
            that.delete_person();
        });

        this.init_table();
    },

    init_table: function() {
        $("#id_table").bootstrapTable({
            locale: "zh-CN",
            pagination: true,
            pageList: [10, 20, 50, 100],
            pageSize: 10,
            uniqueId: "id",
            buttonsPrefix: "btn",
            buttonsClass: "default",
            columns: [
                {checkbox: true},
                {field: "no", title: "身份证号码"},
                {field: "region", title: "地区"},
                {field: "sex", title: "性别"},
                {field: "age", title: "年龄"},
                {field: "phone", title: "手机号码"},
                {field: "create_at", title: "创建时间"},
                {field: "operate", title: "操作"},
            ],
        });

        this.ajax_list_person();
    },

    ajax_list_person: function() {
        var option = {
            url: "/person/list",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({}),

            success: function(data) {
                if (data["errcode"] == 0) {
                    var person_list = data["person_list"];
                    for (var i = 0; i < person_list.length; i++) {
                        person_list[i]["operate"] = '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.person.update_person({0})">编辑</button>'.format(person_list[i]["id"]);
                    }

                    $("#id_table").bootstrapTable("load", person_list);
                } else {

                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {

                }
            },
        };

        $.ajax(option);
    },

    create_person: function() {
        var that = this;

        var option = {
            url: "/person/create",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "age": $("#id_edit_age").val(),
            }),

            success: function(data) {
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                } else {

                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {

                }
            },
        };

        $.ajax(option);
    },

    update_person: function(id) {
        var that = this;
        var row_data = $("#id_table").bootstrapTable('getRowByUniqueId', id);

        if ($("#id_person_dialog").length == 0) {
            $("body").append(this.person_dialog);

            $("#id_dialog_title").text("编辑");
            $("#id_edit_no").val(row_data["no"]);
            $("#id_edit_phone").val(row_data["phone"]);

            $("#id_button_close, #id_button_cancel").click(function() {
                $('#id_person_dialog').modal("hide");
                $('#id_person_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                that.ajax_update_person(id);
            });
        }

        $("#id_person_dialog").modal({backdrop: "static", keyboard: false});
    },

    ajax_update_person: function(id) {
        var that = this;

        var option = {
            url: "/person/update",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "id": id,
                "phone": $("#id_edit_phone").val(),
            }),

            success: function(data) {
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                    $("#id_person_dialog").modal("hide");
                    $("#id_person_dialog").remove();
                } else {

                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {

                }
            },
        };

        $.ajax(option);
    },

    delete_person: function() {
        var select_list = $("#id_table").bootstrapTable("getSelections");
        if (select_list.length == 0) {
            g_message_dialog.show("提示", "请选择需要删除的表项。");
        } else {
            g_confirm_dialog.show("删除", "确认删除选中的 {0} 条个人信息？".format(select_list.length), this, this.ajax_delete_person, select_list);
        }
    },

    ajax_delete_person: function() {
        var that = this;
        var person_list = arguments[0];

        var id_list = [];
        for (var i = 0; i < person_list.length; i++) {
            id_list.push(person_list[i]["id"]);
        }

        var option = {
            url: "/person/delete",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "id_list": id_list,
            }),

            success: function(data) {
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                } else {

                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {

                }
            },
        };

        $.ajax(option);
    },
};
