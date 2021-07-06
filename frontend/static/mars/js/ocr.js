g_web_module.ocr = {
    module_html: `
        <div class="row">
            <div class="col-md-12">
                <form class="form-inline" style="float:left;">
                    <div class="form-group">
                        <label class="control-label">请选择接口：</label>
                        <select id="id_select_interface" class="form-control" style="width:250px;">
                            <option value="">请选择接口</option>
                            <option value="a">测试-通用接口</option>
                            <option value="b">测试-营业执照接口</option>
                            <option value="c">线上-通用接口</option>
                            <option value="d">线上-营业执照接口</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>
        <div class="row" style="margin-top:20px;">
            <div class="col-md-12">
                <form class="form-inline" style="float:left;">
                    <div class="form-group">
                        <label class="control-label">请选择图片：</label>
                        <input id="id_input_file_name" class="form-control" style="width:250px;" type="text" placeholder="请选择图片" readonly="readonly">
                        <input id="id_input_upload_file" type="file" name="file" style="display:none"/>
                        <a id="id_button_select_file" class="btn btn-primary" style="margin-left:5px;">选择图片</a>
                        <a id="id_button_start_ocr" class="btn btn-success" style="margin-left:5px;">开始识别</a>
                    </div>
                </form>
            </div>
        </div>
        <div class="row" style="margin-top:30px;">
            <div class="col-md-12">
                <label class="control-label">OCR识别结果：</label>
                <table id="id_table" class="table table-bordered table-hover table-striped">
                </table>
            </div>
        </div>
        `,

    init: function() {
        var that = this;
        var file_reader = new FileReader();

        $("#id_button_select_file").click(function() {
            return $("#id_input_upload_file").click();
        });

        $("#id_input_upload_file").change(function() {
            var file_path = $("#id_input_upload_file").val();
            $("#id_input_file_name").val(file_path.split("\\").pop());
        });

        $("#id_button_start_ocr").click(function() {
            var ocr_url = $("#id_select_interface").val();
            if (ocr_url == "") {
                g_tips.error("失败", "请选择接口");
                return;
            }

            var file_path = $("#id_input_upload_file").val();
            if (file_path == "") {
                g_tips.error("失败", "请选择图片");
                return;
            }

            var mfile = $("#id_input_upload_file")[0].files[0];
            file_reader.readAsDataURL(mfile);
            file_reader.onload = function() {
                that.ajax_do_ocr(ocr_url, this.result);
            }
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
                {field: "image", title: "图片名称"},
                {field: "result", title: "识别结果"},
                {field: "operate", title: "操作"},
            ],
        });

        this.ajax_list_ocr();
    },

    ajax_list_ocr: function() {
        var that = this;

        var option = {
            url: "/ocr/list_ocr",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({}),

            success: function(data) {
                if (data["errcode"] == 0) {
                    var ocr_list = data["ocr_list"];
                    for (var i = 0; i < ocr_list.length; i++) {
                        ocr_list[i]["operate"] = '<button class="btn btn-outline-primary btn-sm" type="button" onclick="g_web_module.ocr.copy_result({0})">复制</button>'.format(ocr_list[i]["id"]);
                    }

                    $("#id_table").bootstrapTable("load", ocr_list);
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

    ajax_do_ocr: function(ocr_url, image_data) {
        var that = this;

        var option = {
            url: "/ocr/do_ocr",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "ocr_url": ocr_url,
                "image_data": image_data,
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    that.ajax_list_ocr();
                    g_tips.info("成功", "OCR识别成功");
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "OCR识别失败");
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
};
