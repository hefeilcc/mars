g_web_module.person = {
    html: ' \
        <div class="row"> \
            <div class="col-md-12"> \
                <label>年龄：</label> \
                <input id="id_edit_age" class="common_edit" type="text" placeholder="请输入0-100的数字"> \
                &nbsp;&nbsp; \
                <button id="id_button_create" class="common_button" type="button">创建</button> \
            </div> \
        </div> \
        <br> \
        <div class="row"> \
            <div class="col-md-12"> \
                <table id="id_table_person_list"></table> \
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
        $("#id_table_person_list").bootstrapTable({
            //url: '/json/data.json',        // 表格数据来源
            columns: [{
                field: 'id',
                title: '身份证号码'
            }, {
                field: 'name',
                title: '地区'
            }, {
                field: 'price',
                title: '性别'
            },{
                field: 'column1',
                title: '年龄'
            },{
                field: 'column2',
                title: '手机号码' 
            },{
                field: 'column3',
                title: '创建时间'
            },{
                field: 'column4',
                title: '操作'
            } ]
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

