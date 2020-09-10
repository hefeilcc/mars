var g_web_module = {};

var g_message_dialog = {
    dialog_html: ' \
        <div id="id_message_dialog" class="modal" role="dialog" tabindex="-1"> \
            <div class="modal-dialog"> \
                <div class="modal-content"> \
                    <div class="modal-header"> \
                        <button id="id_button_close" class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button> \
                        <h4 id="id_dialog_title" class="modal-title"></h4> \
                    </div> \
                    <div class="modal-body" style="word-wrap:break-word;"> \
                        <span id="id_dialog_content"></span>\
                    </div> \
                <div class="modal-footer"> \
                    <button id="id_button_ok" class="btn btn-primary" type="button">确定</button> \
                    <button id="id_button_cancel" class="btn btn-default" type="button">取消</button> \
                </div> \
            </div> \
        </div> \
        ',

    show: function(type, title, content, target, callback, data) {
        if ($("#id_message_dialog").length == 0) {
            $("body").append(this.dialog_html);

            if (type == "ASK") {

            } else {

            }

            $("#id_dialog_title").text(title);
            $("#id_dialog_content").text(content);

            $("#id_button_close, #id_button_cancel").click(function() {
                $('#id_message_dialog').modal('hide');
                $('#id_message_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                $("#id_message_dialog").modal('hide');
                $("#id_message_dialog").remove();
                if (callback) {
                    callback.call(target, data);
                }
            });
        }

        $('#id_message_dialog').modal({backdrop: "static", keyboard: false});
    },
};
