var g_web_module = {};

var g_message_dialog = {
    html: ' \
        <div id="id_message_dialog" class="modal dialog_base" tabindex="-1"> \
            <div class="dialog_header"> \
                <span id="id_dialog_title"></span> \
                <button id="id_button_close" class="button_x" type="button">&times;</button> \
            </div> \
            <div class="dialog_body"> \
                <span id="id_dialog_content"></span> \
            </div> \
            <div class="dialog_footer"> \
                <button id="id_button_ok" class="btn btn-primary btn-sm" type="button">确定</button> \
            </div> \
        </div> \
        ',

    show: function(title, content) {
        if ($("#id_message_dialog").length == 0) {
            $("body").append(this.html);

            $("#id_dialog_title").text(title);
            $("#id_dialog_content").text(content);

            $("#id_button_close, #id_button_ok").click(function() {
                $('#id_message_dialog').modal("hide");
                $('#id_message_dialog').remove();
            });
        }

        $("#id_message_dialog").modal({backdrop: "static", keyboard: false});
    },
};

var g_confirm_dialog = {
    html: ' \
        <div id="id_confirm_dialog" class="modal dialog_base" tabindex="-1"> \
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
        if ($("#id_confirm_dialog").length == 0) {
            $("body").append(this.html);

            $("#id_dialog_title").text(title);
            $("#id_dialog_content").text(content);

            $("#id_button_close, #id_button_cancel").click(function() {
                $('#id_confirm_dialog').modal("hide");
                $('#id_confirm_dialog').remove();
            });

            $("#id_button_ok").click(function() {
                $("#id_confirm_dialog").modal("hide");
                $("#id_confirm_dialog").remove();
                if (callback) {
                    callback.call(target, data);
                }
            });
        }

        $("#id_confirm_dialog").modal({backdrop: "static", keyboard: false});
    },
};

var g_loading = {
    html: ' \
        <div id="id_loading" class="modal loading_base" tabindex="-1"> \
            <span id="id_loading_text">加载中, 请稍候...</span> \
        </div> \
        ',

    show: function() {
        if ($("#id_loading").length == 0) {
            $("body").append(this.html);
        }
        $("#id_loading").modal({backdrop: "static", keyboard: false});
    },

    hide: function() {
        $("#id_loading").modal("hide");
        $("#id_loading").remove();
    },
};

var g_tips = {
    init: function() {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "1000",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
        };
    },

    info: function(title, message) {
        this.init();
        toastr.success(message, title);   
    },
    
    error: function(title, message) {
        this.init();
        toastr.error(message, title); 
    },
};
