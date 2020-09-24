g_web_module.person = {
    module_html: ' \
        <div class="row"> \
            <div class="col-md-6"> \
                <form class="form-inline" style="float:left;"> \
                    <div class="form-group"> \
                        <label class="control-label">年龄：</label> \
                        <input id="id_edit_age" class="form-control" type="text" placeholder="取值0-100，默认随机"> \
                    </div> \
                </form> \
                <div style="float:left; margin-left:5px;"> \
                    <button id="id_button_create" class="btn btn-primary" type="button">创建</button> \
                    <button id="id_button_delete" class="btn btn-danger" type="button">删除</button> \
                </div> \
            </div> \
            <div class="col-md-6"> \
                <div style="float:right;"> \
                    <button id="id_button_global_search" class="btn btn-primary" type="button">搜索</button> \
                    <button id="id_button_open_advance" class="btn btn-primary" type="button">高级</button> \
                </div> \
                <form class="form-inline" style="float:right; margin-right:5px;"> \
                    <div class="form-group"> \
                        <input id="id_edit_global_search" class="form-control" type="text" placeholder="搜索内容"> \
                    </div> \
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
        <div id="id_person_dialog" class="modal" tabindex="-1"> \
            <div id="id_div_dialog" style="width:420px;"> \
                <div class="dialog_header"> \
                    <span id="id_dialog_title" style="float:left;"></span> \
                    <button id="id_button_close" class="button_x" style="float:right;" type="button">&times;</button> \
                </div> \
                <div class="dialog_body"> \
                    <form id="id_form_edit_person"> \
                        <div class="row" style="margin:5px"> \
                            <div class="col-md-4"> \
                                <span>身份证号码：</span> \
                            </div> \
                            <div class="col-md-8"> \
                                <input id="id_edit_no" class="form-control" type="text" readonly="readonly"> \
                            </div> \
                        </div> \
                        <div class="row" style="margin:5px"> \
                            <div class="col-md-4"> \
                                <span>手机号码：</span> \
                            </div> \
                            <div class="col-md-8"> \
                                <input id="id_edit_phone" class="form-control"  name="person_phone" type="text"> \
                            </div> \
                        </div> \
                    </form> \
                </div> \
                <div class="dialog_footer"> \
                    <button id="id_button_ok" class="btn btn-primary btn-sm" style="float:right; margin-top:7px; margin-left:5px;" type="button">确定</button> \
                    <button id="id_button_cancel" class="btn btn-secondary btn-sm" style="float:right; margin-top:7px; margin-left:5px;" type="button">取消</button> \
                </div> \
            </div> \
        </div> \
        ',

    init: function() {
        var that = this;

        $("#id_button_global_search").click(function() {
            that.global_search();
        });

        $("#id_button_create").click(function() {
            that.create_person();
        });

        $("#id_button_delete").click(function() {
            that.delete_person();
        });

        this.init_table();
    },

    global_search: function() {

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
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "获取个人信息失败");
                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                g_tips.error("失败", "内部错误: {0}".format(XMLHttpRequest.status));
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
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                    g_tips.info("成功", "创建个人信息成功");
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "创建个人信息失败");
                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                g_loading.hide();
                g_tips.error("失败", "内部错误: {0}".format(XMLHttpRequest.status));
            },
        };

        g_loading.show();
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
                that.edit_person_validate();
                if (!$("#id_form_edit_person").validate().form()) {
                    return;
                }
                that.ajax_update_person(id);
            });

            $("#id_person_dialog").on("shown.bs.modal", function() {
                $("#id_div_dialog").css({
                    "position": "relative",
                    "top": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").height()),
                    "left": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").width()),
                });
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
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                    $("#id_person_dialog").modal("hide");
                    $("#id_person_dialog").remove();
                    g_tips.info("成功", "更新个人信息成功");
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "更新个人信息失败");
                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                g_loading.hide();
                g_tips.error("失败", "内部错误: {0}".format(XMLHttpRequest.status));
            },
        };

        g_loading.show();
        $.ajax(option);
    },

    delete_person: function() {
        var select_list = $("#id_table").bootstrapTable("getSelections");
        if (select_list.length == 0) {
            g_message_dialog.show("提示", "请选择需要删除的表项。");
        } else {
            g_message_dialog.show("删除", "确认删除选中的 {0} 条个人信息？".format(select_list.length), this, this.ajax_delete_person, select_list);
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
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                    g_tips.info("成功", "删除个人信息成功");
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "删除个人信息失败");
                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                g_loading.hide();
                g_tips.error("失败", "内部错误: {0}".format(XMLHttpRequest.status));
            },
        };

        g_loading.show();
        $.ajax(option);
    },

    edit_person_validate: function() {
        $("#id_form_edit_person").validate({
            errorElement: "span",
            errorClass: "input_error",

            rules: {
                person_phone: {
                    required: true,
                },
            },

            messages: {
                person_phone: {
                    required: "请输入手机号码",
                },
            },
        });
    },
};
