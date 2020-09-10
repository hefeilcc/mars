g_web_module.person = {
    module_html: ' \
        <div class="row"> \
            <div class="col-md-12"> \
                <form class="form-inline"> \
                    <label>年龄：</label> \
                    <input id="id_edit_age" class="form-control" type="text" placeholder="取值0-100，默认随机"> \
                    &nbsp;&nbsp; \
                    <button id="id_button_create" class="btn btn-primary" type="button">创建</button> \
                    &nbsp;&nbsp; \
                    <button id="id_button_delete" class="btn btn-danger" type="button">删除</button> \
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

    init: function() {
        var that = this;

        $("#id_button_create").click(function() {
            that.create_person();
        });

        this.init_table();
    },

    init_table: function() {
        $("#id_table").bootstrapTable({
            locale: "zh-CN",
            pagination: true,
            pageList: [10, 20, 50, 100],
            pageSize: 10,
            buttonsPrefix: "btn",
            buttonsClass: "default",
            columns: [
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
                        person_list[i]["operate"] = '<button class="btn btn-outline-primary btn-sm" type="button">编辑</button>';
                    }

                    $('#id_table').bootstrapTable("load", person_list);
                } else {

                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {

                }
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
                if (data["errcode"] == 0) {
                    that.ajax_list_person();
                } else {

                }
            },

            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status != 200) {

                }
            },
        };

        $.ajax(option);
    },
};
