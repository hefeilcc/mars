g_web_module.person = {
    html: ' \
        <div class="row"> \
            <div class="col-sm-4"> \
                <label class="control-label">年龄</label> \
            </div> \
            <div class="col-sm-4"> \
                <input id="id_edit_age" class="form-control" type="text" placeholder="填写0-100的数字"> \
            </div> \
            <div class="col-sm-4"> \
                <button id="id_button_create" class="btn btn-default" type="button">创建</button> \
            </div> \
        </div> \
        <br> \
        <div class="row"> \
            <div class="col-md-12"> \
                <table id="id_table_person_list" class="table table-striped table-bordered table-hover"> \
                    <thead> \
                        <tr> \
                            <th>身份证号码</th> \
                            <th>地区</th> \
                            <th>性别</th> \
                            <th>年龄</th> \
                            <th>手机号码</th> \
                            <th>创建时间</th> \
                            <th>操作</th> \
                        </tr> \
                    </thead> \
                    <tbody> \
                    </tbody> \
                </table> \
            </div> \
        </div> \
        ',

    init: function() {
        $("#id_btn_create").click(function() {
            this.ajax_get_person_list("/create");
        });

        this.init_table();
    },

    init_table: function() {
        this.data_table = $('#id_table_person_list').dataTable({
            bSort: false,
            bSearch: false,
            bFilter: true,
            aLengthMenu: [5, 10, 20, 100],
            iDisplayLength: 10,
            bScrollAutoCss: true,
            oLanguage: {
                sLengthMenu: "每页 _MENU_ 条",
                sZeroRecords: "对不起，查询不到相关数据！",
                sEmptyTable: "暂无信息！",
                sInfoEmpty: "当前显示 0 到 0 条",
                sInfo: "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                sInfoFiltered: "数据表中共为 _MAX_ 条记录",
                oPaginate: {
                    sFirst: "首页",
                    sPrevious: "上一页",
                    sNext: "下一页",
                    sLast: "末页"
                },
            },

            fnCreatedRow: function(nRow, aData, iDisplayIndex) {
                return nRow;
            }
        });
    },

    ajax_get_person_list: function(url) {
        var that = this;

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

