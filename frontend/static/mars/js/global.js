var g_web_module = {};

var g_message_dialog = {
    dialog_html: ' \
        <div id="id_message_dialog" class="modal" tabindex="-1"> \
            <div class="dialog_header"> \
                <span id="id_dialog_title"></span> \
                <button id="id_button_close" class="button_x" type="button">&times;</button> \
            </div> \
            <div class="dialog_body"> \
                <span id="id_dialog_content"></span> \
            </div> \
            <div class="dialog_footer"> \
                <button id="id_button_cancel" class="btn btn-secondary btn-sm" type="button">取消</button> \
                &nbsp;&nbsp; \
                <button id="id_button_ok" class="btn btn-primary btn-sm" type="button">确定</button> \
            </div> \
        </div> \
        ',

    show: function(title, content, target, callback, data) {
        if ($("#id_message_dialog").length == 0) {
            $("body").append(this.dialog_html);

            $("#id_dialog_title").text(title);
            $("#id_dialog_content").text(content);

            $("#id_button_cancel, #id_button_close").click(function() {
                $('#id_message_dialog').modal("hide");
                $('#id_message_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                $("#id_message_dialog").modal("hide");
                $("#id_message_dialog").remove();
                if (callback) {
                    callback.call(target, data);
                }
            });
        }

        $("#id_message_dialog").modal({backdrop: "static", keyboard: false});
    },
};
