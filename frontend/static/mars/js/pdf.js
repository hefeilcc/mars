g_web_module.pdf = {
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
                        <label class="control-label">请选择文件：</label>
                        <input id="id_input_file_name" class="form-control" style="width:250px;" type="text" placeholder="请选择小于50M的PDF文件" readonly="readonly">
                        <input id="id_input_upload_file" type="file" name="file" style="display:none"/>
                        <a id="id_button_select_file" class="btn btn-primary" style="margin-left:5px;">选择文件</a>
                        <a id="id_button_start_convert" class="btn btn-success" style="margin-left:5px;">开始转换</a>
                    </div>
                </form>
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

        $("#id_button_start_convert").click(function() {
            var pdf_url = $("#id_select_interface").val();
            if (pdf_url == "") {
                g_tips.error("失败", "请选择接口");
                return;
            }

            var file_path = $("#id_input_upload_file").val();
            if (file_path == "") {
                g_tips.error("失败", "请选择PDF文件");
                return;
            }

            var mfile = $("#id_input_upload_file")[0].files[0];
            file_reader.readAsDataURL(mfile);
            file_reader.onload = function() {
                that.ajax_convert(pdf_url, this.result);
            }
        });
    },

    ajax_convert: function(pdf_url, pdf_data) {
        var that = this;

        var option = {
            url: "/pdf/pdf2word",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "pdf_url": pdf_url,
                "pdf_data": pdf_data,
            }),

            success: function(data) {
                g_loading.hide();
                if (data["errcode"] == 0) {
                    g_tips.info("成功", "PDF转WORD成功");
                    that.download_file(data["result_file"], "test.pdf");
                } else if (data["errcode"] == 100) {
                    window.location.href = "/";
                } else {
                    g_tips.error("失败", "PDF转WORD失败");
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

    download_file: function(file_name, display_name) {
        var inputs = '<input type="hidden" name="file_name" value="' + file_name + '"/>';
        inputs += '<input type="hidden" name="display_name" value="' + display_name + '"/>';
        jQuery('<form action=/pdf/download_result method=post>' + inputs + '</form>').appendTo('body').submit().remove();
    },
};
