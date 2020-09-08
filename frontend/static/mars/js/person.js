g_web_module.person = {
    html: ' \
        <div class="row"> \
            <div class="col-md-12"> \
                <form class="form-inline"> \
                    <label>年龄：</label> \
                    <input id="id_edit_age" class="form-control" type="text" placeholder="请输入0-100的数字"> \
                    &nbsp;&nbsp; \
                    <button id="id_button_create" class="btn btn-primary" type="button">创建</button> \
                    &nbsp;&nbsp; \
                    <button id="id_button_delete" class="btn btn-danger" type="button">删除</button> \
                </form> \
            </div> \
        </div> \
        <div class="row" style="margin-top:20px;"> \
            <div class="col-md-12"> \
                <table id="id_table" class="table table-bordered table-hover table-striped"></table> \
            </div> \
        </div> \
        ',

    init: function() {
        $("#id_button_create").click(function() {
            this.ajax_list_person("/person/list");
        });

        this.init_table();
    },

    init_table: function() {
        var td_operate = '<button class="btn btn-outline-primary btn-sm" type="button">编辑</button>';

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
                {field: "create", title: "创建时间"},
                {field: "operate", title: "操作"},
            ],
            data: [
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000000", region: "合肥", sex: "男", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
                {no: "000000000000000001", region: "舒城", sex: "女", age: 18, phone: "13800000000", create: "2020-09-08 20:00:00", operate: td_operate},
            ],
        });
    },

    ajax_list_person: function(url) {
        var that = this;
        return;

        var option = {
            url: url,
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                "age": $("#id_edit_age").val(),
            },

            success: function(data) {
                var all_rows = [];
                var aiDisplayMaster = [];

                var person_list = data.person_list;
                for (var i = 0; i < person_list.length; i++) {
                    var person = person_list[i];
                    all_rows[i] = [
                                    i + 1,
                                    person.code,
                                    person.addr,
                                    person.sex,
                                    person.age,
                                    person.phone,
                                    person.create_time,
                                ];

                    aiDisplayMaster[i] = i;
                }

                that.data_table.fnClearTable();

                if (all_rows.length > 0) {
                    that.data_table.fnAddData(all_rows, true, aiDisplayMaster);
                }
            },
        };

        $.ajax(option);
    },
};

