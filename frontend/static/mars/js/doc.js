g_web_module.doc = {
    module_html: `
        <div class="row">
            <div class="col-md-6">
                <div style="float:left;">
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

    doc_dialog: `
        <div id="id_doc_dialog" class="modal" tabindex="-1">
            <div id="id_div_dialog" style="width:600px;">
                <div class="dialog_header">
                    <span id="id_dialog_title" style="float:left;"></span>
                    <button id="id_button_close" class="button_x" style="float:right;">✕</button>
                </div>
                <div class="dialog_body">
                    <form id="id_form_edit_doc" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-md-2 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">分类<span style="color:red;">*</span></label>
                            <div class="col-md-10" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_category" class="form-control" name="doc_category" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">标题<span style="color:red;">*</span></label>
                            <div class="col-md-10" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_title" class="form-control" name="doc_title" type="text">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-2 control-label" style="text-align:right; vertical-align:top; margin-top:7px;">文档<span style="color:red;">*</span></label>
                            <div class="col-md-7" style="display:inline-block; margin-left:-5px; padding-left:0;">
                                <input id="id_edit_file" class="form-control" name="doc_file" type="text" readonly="readonly">
                            </div>
                            <input id="id_input_upload_file" type="file" name="file" style="display:none"/>
                            <a id="id_button_select_file" class="btn btn-primary" style="margin-top:-5px;">选择文件</a>
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
            that.create_doc();
        });

        $("#id_button_delete").click(function() {
            that.delete_doc();
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
                {field: "title", title: "标题"},
                {field: "update_at", title: "更新时间"},
                {field: "sharer", title: "分享人"},
                {field: "operate", title: "操作"},
            ],
        });

        this.ajax_list_doc();
    },

    ajax_list_doc: function() {
        var that = this;

        var option = {
            url: "/doc/list",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({}),

            success: function(data) {
                if (data["errcode"] == 0) {
                    that.clear_search();

                    var doc_list = data["doc_list"];
                    for (var i = 0; i < doc_list.length; i++) {
                        doc_list[i]["operate"] = '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.doc.preview_doc({0})">预览</button> '.format(doc_list[i]["id"]);
                        doc_list[i]["operate"] += '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.doc.update_doc({0})">编辑</button> '.format(doc_list[i]["id"]);
                        doc_list[i]["operate"] += '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.doc.download_doc({0})">下载</button> '.format(doc_list[i]["id"]);
                    }

                    $("#id_table").bootstrapTable("load", doc_list);
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

    create_doc: function() {
        var that = this;
        var file_reader = new FileReader();

        if ($("#id_doc_dialog").length == 0) {
            $("body").append(this.doc_dialog);

            $("#id_dialog_title").text("创建");

            $("#id_button_select_file").click(function() {
                return $("#id_input_upload_file").click();
            });

            $("#id_input_upload_file").change(function() {
                var file_path = $("#id_input_upload_file").val();
                $("#id_edit_file").val(file_path.split("\\").pop());
            });

            $("#id_button_close, #id_button_cancel").click(function() {
                $('#id_doc_dialog').modal("hide");
                $('#id_doc_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                that.create_doc_validate();
                if (!$("#id_form_edit_doc").validate().form()) {
                    return;
                }

                var mfile = $("#id_input_upload_file")[0].files[0];
                file_reader.readAsDataURL(mfile);
                file_reader.onload = function() {
                    that.ajax_create_doc(this.result);
                }
            });

            $("#id_doc_dialog").on("shown.bs.modal", function() {
                $("#id_div_dialog").css({
                    "position": "relative",
                    "top": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").height()),
                    "left": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").width()),
                });
            });
        }

        $("#id_doc_dialog").modal({backdrop: "static", keyboard: false});
    },

    ajax_create_doc: function(file_data) {
        var that = this;

        var option = {
            url: "/doc/create",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "category": $("#id_edit_category").val(),
                "title": $("#id_edit_title").val(),
                "file_data": file_data,
                "sharer": $(".user_info").text(),
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_doc();
                    $("#id_doc_dialog").modal("hide");
                    $("#id_doc_dialog").remove();
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

    preview_doc: function(id) {

    },

    update_doc: function(id) {
        var that = this;
        var file_reader = new FileReader();
        var row_data = $("#id_table").bootstrapTable('getRowByUniqueId', id);

        if ($("#id_doc_dialog").length == 0) {
            $("body").append(this.doc_dialog);

            $("#id_dialog_title").text("编辑");
            $("#id_edit_category").val(row_data["category"]);
            $("#id_edit_title").val(row_data["title"]);
            $("#id_edit_file").attr("placeholder", "若文档不变，不必上传。");

            $("#id_button_select_file").click(function() {
                return $("#id_input_upload_file").click();
            });

            $("#id_input_upload_file").change(function() {
                var file_path = $("#id_input_upload_file").val();
                $("#id_edit_file").val(file_path.split("\\").pop());
            });

            $("#id_button_close, #id_button_cancel").click(function() {
                $('#id_doc_dialog').modal("hide");
                $('#id_doc_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                that.edit_doc_validate();
                if (!$("#id_form_edit_doc").validate().form()) {
                    return;
                }

                if ($("#id_edit_file").val() != "") {
                    var mfile = $("#id_input_upload_file")[0].files[0];
                    file_reader.readAsDataURL(mfile);
                    file_reader.onload = function() {
                        that.ajax_update_doc(id, this.result);
                    }
                } else {
                    that.ajax_update_doc(id, "");
                }
            });

            $("#id_doc_dialog").on("shown.bs.modal", function() {
                $("#id_div_dialog").css({
                    "position": "relative",
                    "top": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").height()),
                    "left": "calc((100% - {0}px) / 2)".format($("#id_div_dialog").width()),
                });
            });
        }

        $("#id_doc_dialog").modal({backdrop: "static", keyboard: false});
    },

    ajax_update_doc: function(id, file_data) {
        var that = this;

        var option = {
            url: "/doc/update",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "id": id,
                "category": $("#id_edit_category").val(),
                "title": $("#id_edit_title").val(),
                "file_data": file_data,
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_doc();
                    $("#id_doc_dialog").modal("hide");
                    $("#id_doc_dialog").remove();
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

    download_doc: function(id) {
        var inputs = '<input type="hidden" name="doc_id" value="' + id + '"/>';
        jQuery('<form action=/doc/download method=post>' + inputs + '</form>').appendTo('body').submit().remove();
    },

    delete_doc: function() {
        var select_list = $("#id_table").bootstrapTable("getSelections");
        if (select_list.length == 0) {
            g_message_dialog.show("提示", "请选择需要删除的表项。");
        } else {
            g_message_dialog.show("删除", "确认删除选中的 {0} 条数据？".format(select_list.length), this, this.ajax_delete_doc, select_list);
        }
    },

    ajax_delete_doc: function() {
        var that = this;
        var doc_list = arguments[0];

        var id_list = [];
        for (var i = 0; i < doc_list.length; i++) {
            id_list.push(doc_list[i]["id"]);
        }

        var option = {
            url: "/doc/delete",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "id_list": id_list,
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_doc();
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

    create_doc_validate: function() {
        $("#id_form_edit_doc").validate({
            errorElement: "span",
            errorClass: "input_error",

            rules: {
                doc_category: {
                    required: true,
                },
                doc_title: {
                    required: true,
                },
                doc_file: {
                    required: true,
                },
            },

            messages: {
                doc_category: {
                    required: "请输入分类",
                },
                doc_title: {
                    required: "请输入问题描述",
                },
                doc_file: {
                    required: "请选择文件",
                },
            },
        });
    },

    edit_doc_validate: function() {
        $("#id_form_edit_doc").validate({
            errorElement: "span",
            errorClass: "input_error",

            rules: {
                doc_category: {
                    required: true,
                },
                doc_title: {
                    required: true,
                },
            },

            messages: {
                doc_category: {
                    required: "请输入分类",
                },
                doc_title: {
                    required: "请输入问题描述",
                },
            },
        });
    },
};
