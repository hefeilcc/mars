g_web_module.person = {
    module_html: `
        <div class="row">
            <div class="col-md-6">
                <form class="form-inline" style="float:left;">
                    <div class="form-group">
                        <label class="control-label">年龄：</label>
                        <input id="id_edit_age" class="form-control" type="text" placeholder="取值0-100，默认随机">
                    </div>
                </form>
                <div style="float:left; margin-left:5px;">
                    <button id="id_button_create" class="btn btn-primary" type="button">创建</button>
                    <button id="id_button_delete" class="btn btn-danger" type="button">删除</button>
                </div>
            </div>
            <div class="col-md-6">
                <div style="float:right;">
                    <button id="id_button_global_search" class="btn btn-primary" type="button">搜索</button>
                </div>
                <form class="form-inline" style="float:right; margin-right:5px;">
                    <div class="form-group">
                        <input id="id_edit_global_search" class="form-control" type="text" placeholder="搜索内容">
                    </div>
                </form>
            </div>
        </div>
        <div class="row" style="margin-top:20px;">
            <div class="col-md-12">
                <table id="id_table" class="table table-bordered table-hover table-striped">
                </table>
            </div>
        </div>
        `,

    person_dialog: `
        <div id="id_person_dialog" class="modal" tabindex="-1">
            <div id="id_div_dialog" style="width:420px;">
                <div class="dialog_header">
                    <span id="id_dialog_title" style="float:left;"></span>
                    <button id="id_button_close" class="button_x" style="float:right;">✕</button>
                </div>
                <div class="dialog_body">
                    <form id="id_form_edit_person" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-4 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">身份证</label>
                            <div class="col-md-8" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_id_card" class="form-control" type="text" readonly="readonly">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">手机号码<span style="color:red;">*</span></label>
                            <div class="col-md-8" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_phone" class="form-control" name="person_phone" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-4 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">地区<span style="color:red;">*</span></label>
                            <div class="col-md-8" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_region" class="form-control" name="person_region" type="text">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="dialog_footer">
                    <button id="id_button_ok" class="btn btn-primary btn-sm" style="float:right; margin-left:5px;" type="button">确定</button>
                    <button id="id_button_cancel" class="btn btn-secondary btn-sm" style="float:right; margin-left:5px;" type="button">取消</button>
                </div>
            </div>
        </div>
        `,

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

    clear_search: function() {
        var options = {
            "filterAlgorithm": function(row, filter) {
                return true;
            },
        };

        $("#id_table").bootstrapTable("filterBy", {}, options);
    },

    global_search: function() {
        var content = $("#id_edit_global_search").val().trim();
        if (content == "") {
            this.clear_search();
            return;
        }

        var filter = {"value": content};
        var options = {
            "filterAlgorithm": function(row, filter) {
                for (var key in row) {
                    if (key == "id" || key == "operate") {
                        continue;
                    } else {
                        if (String(row[key]).indexOf(filter.value) >= 0) {
                            return true;
                        }
                    }
                }
                return false;
            },
        };

        $("#id_table").bootstrapTable("filterBy", filter, options);
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
                {field: "id_card", title: "身份证号码"},
                {field: "region", title: "地区"},
                {field: "sex", title: "性别"},
                {field: "age", title: "年龄"},
                {field: "phone", title: "手机号码"},
                {field: "create_at", title: "创建时间"},
                {field: "status", title: "状态", align: "center"},
                {field: "operate", title: "操作"},
            ],
        });

        this.ajax_list_person();
    },

    ajax_list_person: function() {
        var that = this;

        var option = {
            url: "/person/list",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({}),

            success: function(data) {
                if (data["errcode"] == 0) {
                    that.clear_search();

                    var person_list = data["person_list"];
                    for (var i = 0; i < person_list.length; i++) {
                        if (person_list[i]["status"] == 0) {
                            person_list[i]["status"] = '<a onclick="g_web_module.person.switch_status({0}, 1)"><i class="fa fa-star-o" style="font-size:20px;" title="未使用" aria-hidden="true"></i></a>'.format(person_list[i]["id"]);
                        } else {
                            person_list[i]["status"] = '<a onclick="g_web_module.person.switch_status({0}, 0)"><i class="fa fa-star" style="font-size:20px; color:red;" title="已使用" aria-hidden="true"></i></a>'.format(person_list[i]["id"]);
                        }
                        person_list[i]["operate"] = '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.person.update_person({0})">编辑</button>'.format(person_list[i]["id"]);
                    }

                    $("#id_table").bootstrapTable("load", person_list);
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "获取数据失败");
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
            $("#id_edit_id_card").val(row_data["id_card"]);
            $("#id_edit_phone").val(row_data["phone"]);
            $("#id_edit_region").val(row_data["region"]);

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
                "region": $("#id_edit_region").val(),
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

    switch_status: function(id, status) {
        var that = this;

        var option = {
            url: "/person/switch_status",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "id": id,
                "status": status,
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                    $("#id_person_dialog").modal("hide");
                    $("#id_person_dialog").remove();
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "更新失败");
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
                person_region: {
                    required: true,
                },
            },

            messages: {
                person_phone: {
                    required: "请输入手机号码",
                },
                person_region: {
                    required: "请输入地区",
                },
            },
        });
    },
};
