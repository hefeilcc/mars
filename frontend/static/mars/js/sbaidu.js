g_web_module.sbaidu = {
    module_html: `
        <div class="row">
            <div class="col-md-6">
                <div style="float:left;">
                    <button id="id_button_create" class="btn btn-primary" type="button">创建</button>
                    <button id="id_button_delete" class="btn btn-danger" type="button">删除</button>
                    <button id="id_button_import" class="btn btn-primary" type="button">导入</button>
                    <button id="id_button_export" class="btn btn-primary" type="button">导出</button>
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

    sbaidu_dialog: `
        <div id="id_sbaidu_dialog" class="modal" tabindex="-1">
            <div id="id_div_dialog" style="width:700px;">
                <div class="dialog_header">
                    <span id="id_dialog_title" style="float:left;"></span>
                    <button id="id_button_close" class="button_x" style="float:right;">✕</button>
                </div>
                <div class="dialog_body">
                    <form id="id_form_edit_sbaidu" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-2 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">分类<span style="color:red;">*</span></label>
                            <div class="col-md-10" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_category" class="form-control" name="sbaidu_category" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">问题描述<span style="color:red;">*</span></label>
                            <div class="col-md-10" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_question" class="form-control" name="sbaidu_question" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">解决方法</label>
                            <div class="col-md-10" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <textarea id="id_edit_solution" class="form-control" name="sbaidu_solution" rows="3" type="text"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">备注</label>
                            <div class="col-md-10" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <textarea id="id_edit_remark" class="form-control" name="sbaidu_remark" rows="3" type="text"></textarea>
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
            that.create_sbaidu();
        });

        $("#id_button_delete").click(function() {
            that.delete_sbaidu();
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
                {field: "category", title: "分类"},
                {field: "question", title: "问题描述"},
                {field: "update_at", title: "更新时间"},
                {field: "sharer", title: "分享人"},
                {field: "operate", title: "操作"},
            ],
        });

        this.ajax_list_sbaidu();
    },

    ajax_list_sbaidu: function() {
        var that = this;

        var option = {
            url: "/sbaidu/list",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({}),

            success: function(data) {
                if (data["errcode"] == 0) {
                    that.clear_search();

                    var sbaidu_list = data["sbaidu_list"];
                    for (var i = 0; i < sbaidu_list.length; i++) {
                        sbaidu_list[i]["operate"] = '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.sbaidu.update_sbaidu({0},1)">查看</button> '.format(sbaidu_list[i]["id"]);
                        sbaidu_list[i]["operate"] += '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.sbaidu.update_sbaidu({0},0)">编辑</button> '.format(sbaidu_list[i]["id"]);
                    }

                    $("#id_table").bootstrapTable("load", sbaidu_list);
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

    create_sbaidu: function() {
        var that = this;

        if ($("#id_sbaidu_dialog").length == 0) {
            $("body").append(this.sbaidu_dialog);

            $("#id_dialog_title").text("创建");

            $("#id_button_close, #id_button_cancel").click(function() {
                $('#id_sbaidu_dialog').modal("hide");
                $('#id_sbaidu_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                that.edit_sbaidu_validate();
                if (!$("#id_form_edit_sbaidu").validate().form()) {
                    return;
                }
                that.ajax_create_sbaidu();
            });

            $("#id_sbaidu_dialog").on("shown.bs.modal", function() {
                $("#id_div_dialog").css({
                    "position": "relative",
                    "top": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").height()),
                    "left": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").width()),
                });
            });
        }

        $("#id_sbaidu_dialog").modal({backdrop: "static", keyboard: false});
    },

    ajax_create_sbaidu: function() {
        var that = this;

        var option = {
            url: "/sbaidu/create",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "category": $("#id_edit_category").val(),
                "question": $("#id_edit_question").val(),
                "solution": $("#id_edit_solution").val(),
                "sharer": $(".user_info").text(),
                "remark": $("#id_edit_remark").val(),
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_sbaidu();
                    $("#id_sbaidu_dialog").modal("hide");
                    $("#id_sbaidu_dialog").remove();
                    g_tips.info("成功", "创建成功");
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "创建失败");
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

    update_sbaidu: function(id, readonly) {
        var that = this;
        var row_data = $("#id_table").bootstrapTable('getRowByUniqueId', id);

        if ($("#id_sbaidu_dialog").length == 0) {
            $("body").append(this.sbaidu_dialog);

            $("#id_dialog_title").text("编辑");
            $("#id_edit_category").val(row_data["category"]);
            $("#id_edit_question").val(row_data["question"]);
            $("#id_edit_solution").val(row_data["solution"]);
            $("#id_edit_remark").val(row_data["remark"]);

            if (readonly == 1) {
                $("#id_dialog_title").text("查看");
                $("#id_edit_category").attr("readonly", "readonly");
                $("#id_edit_question").attr("readonly", "readonly");
                $("#id_edit_solution").attr("readonly", "readonly");
                $("#id_edit_remark").attr("readonly", "readonly");
                $("#id_button_ok").hide();
            }

            $("#id_button_close, #id_button_cancel").click(function() {
                $('#id_sbaidu_dialog').modal("hide");
                $('#id_sbaidu_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                that.edit_sbaidu_validate();
                if (!$("#id_form_edit_sbaidu").validate().form()) {
                    return;
                }
                that.ajax_update_sbaidu(id);
            });

            $("#id_sbaidu_dialog").on("shown.bs.modal", function() {
                $("#id_div_dialog").css({
                    "position": "relative",
                    "top": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").height()),
                    "left": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").width()),
                });
            });
        }

        $("#id_sbaidu_dialog").modal({backdrop: "static", keyboard: false});
    },

    ajax_update_sbaidu: function(id) {
        var that = this;

        var option = {
            url: "/sbaidu/update",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "id": id,
                "category": $("#id_edit_category").val(),
                "question": $("#id_edit_question").val(),
                "solution": $("#id_edit_solution").val(),
                "remark": $("#id_edit_remark").val(),
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_sbaidu();
                    $("#id_sbaidu_dialog").modal("hide");
                    $("#id_sbaidu_dialog").remove();
                    g_tips.info("成功", "更新成功");
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

    delete_sbaidu: function() {
        var select_list = $("#id_table").bootstrapTable("getSelections");
        if (select_list.length == 0) {
            g_message_dialog.show("提示", "请选择需要删除的表项。");
        } else {
            g_message_dialog.show("删除", "确认删除选中的 {0} 条数据？".format(select_list.length), this, this.ajax_delete_sbaidu, select_list);
        }
    },

    ajax_delete_sbaidu: function() {
        var that = this;
        var sbaidu_list = arguments[0];

        var id_list = [];
        for (var i = 0; i < sbaidu_list.length; i++) {
            id_list.push(sbaidu_list[i]["id"]);
        }

        var option = {
            url: "/sbaidu/delete",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "id_list": id_list,
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_sbaidu();
                    g_tips.info("成功", "删除成功");
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "删除失败");
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

    edit_sbaidu_validate: function() {
        $("#id_form_edit_sbaidu").validate({
            errorElement: "span",
            errorClass: "input_error",

            rules: {
                sbaidu_category: {
                    required: true,
                },
                sbaidu_question: {
                    required: true,
                },
            },

            messages: {
                sbaidu_category: {
                    required: "请输入分类",
                },
                sbaidu_question: {
                    required: "请输入问题描述",
                },
            },
        });
    },
};
