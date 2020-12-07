/* js string format */
String.prototype.format = function() {
    a = this;
    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k]);
    }
    return a;
};

/* all sub-page object */
var g_web_module = {};

/* message dialog */
var g_message_dialog = {
    html: ' \
        <div id="id_message_dialog" class="modal" tabindex="-1"> \
            <div id="id_dialog_display" style="width:400px;"> \
                <div class="dialog_header"> \
                    <span id="id_dialog_title" style="float:left;"></span> \
                    <button id="id_button_close" class="button_x" style="float:right;">✕</button> \
                </div> \
                <div class="dialog_body"> \
                    <span id="id_dialog_content"></span> \
                </div> \
                <div class="dialog_footer"> \
                    <button id="id_button_ok" class="btn btn-primary btn-sm" style="float:right;">确定</button> \
                    <button id="id_button_cancel" class="btn btn-secondary btn-sm" style="margin-right:5px; float:right;">取消</button> \
                </div> \
            </div> \
        </div>',

    show: function(title, content, target, callback, data) {
        if ($("#id_message_dialog").length > 0) {
            return;
        }

        $("body").append(this.html);

        if (callback) {
            $("#id_button_cancel").show();
        } else {
            $("#id_button_cancel").hide();
        }

        $("#id_dialog_title").text(title);
        $("#id_dialog_content").text(content);

        $("#id_button_close, #id_button_cancel").click(function() {
            $('#id_message_dialog').modal("hide");
            $("#id_message_dialog").remove();
        });

        $("#id_button_ok").click(function() {
            $("#id_message_dialog").modal("hide");
            $("#id_message_dialog").remove();
            if (callback) {
                callback.call(target, data);
            }
        });

        $("#id_message_dialog").on("shown.bs.modal", function() {
            $("#id_dialog_display").css({
                "position": "relative",
                "top": "calc((100% - {0}px) / 2)".format($("#id_dialog_display").height()),
                "left": "calc((100% - {0}px) / 2)".format($("#id_dialog_display").width()),
            });
        });

        $("#id_message_dialog").modal({backdrop: "static", keyboard: false});
    },
};

/* loading bar */
var g_loading = {
    html: ' \
        <div id="id_loading" class="modal" tabindex="-1"> \
            <div id="id_div_loading"> \
                <div id="id_loading_image"></div> \
                <span id="id_loading_text">处理中, 请稍候...</span> \
            </div> \
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

/* tips */
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
