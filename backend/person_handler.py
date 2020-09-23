# -*- coding: UTF-8 -*-
import json
import random
import time
import tornado
from tornado import web
from tornado import gen

from decorator_handler import login_required
from db.mysql import api as mysql_api
from utils import logger

class PersonHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def post(self, handler):
        method = getattr(self, handler)
        para = json.loads(self.request.body)
        response = yield method(para)
        self.finish(json.dumps(response))

    @gen.coroutine
    @login_required
    def list(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        person_list = []
        result = mysql_api.list_person()
        for item in result:
            temp_dict = {
                "id": item.id,
                "no": item.no,
                "region": item.region,
                "sex": item.sex,
                "age": item.age,
                "phone": item.phone,
                "create_at": item.create_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            person_list.append(temp_dict)

        response["person_list"] = person_list
        return response

    @gen.coroutine
    @login_required
    def create(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        age = para["age"]
        person_info = self.__create_person_info(age)

        mysql_api.create_person(person_info)

        return response

    @gen.coroutine
    @login_required
    def update(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        id = para["id"]
        phone = para["phone"]
        mysql_api.update_person(id, phone)

        return response

    @gen.coroutine
    @login_required
    def delete(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        id_list = para["id_list"]
        mysql_api.delete_person(id_list)

        return response

    def __create_person_info(self, age):
        code_list = self.__get_district_code_list()
        index = random.randint(0, len(code_list))

        id_str = code_list[index]["code"] # 地区

        current_date = time.localtime()
        if age:
            born_year = current_date.tm_year - int(age)
            start_date = time.mktime((born_year, 1, 1, 0, 0, 0, 0, 0, 0))
            end_date = time.mktime((born_year, 12, 31, 0, 0, 0, 0, 0, 0))
        else:
            start_date = time.mktime((1950, 1, 1, 0, 0, 0, 0, 0, 0))
            end_date = time.mktime((2010, 1, 1, 0, 0, 0, 0, 0, 0))

        rand_date = random.randint(start_date, end_date)
        rand_date_touple = time.localtime(rand_date)
        rand_date_str = time.strftime("%Y%m%d", rand_date_touple)

        age = current_date.tm_year - rand_date_touple.tm_year

        id_str += rand_date_str # 出生日期

        id_str += str(random.randint(100, 300)) # 顺序号

        weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        check_code = ["1","0","X","9","8","7","6","5","4","3","2"]
        count = 0
        for i in range(0, len(id_str)):
            count += int(id_str[i]) * weight[i]

        id_str += check_code[count % 11] # 校验码

        phone_pre_list = ["130","131","132","133","134","135","136","137","138","139","147","150","151","152","153","155","156","157","158","159","186","187","188"]
        phone_number = random.choice(phone_pre_list) + "".join(random.choice("0123456789") for i in range(8))

        create_time = time.strftime("%Y-%m-%d %H:%M:%S", current_date)

        result = {
            "no": id_str,
            "region": code_list[index]["state"] + code_list[index]["city"] + code_list[index]["district"],
            "sex": "女" if int(id_str[16]) % 2 == 0 else "男",
            "age": age,
            "phone": phone_number,
        }

        return result

    def __get_district_code_list(self):
        file_path = "%s/misc/%s" % (self.application.current_path, "district_code.txt")
        district_list = []
        with open(file_path) as file:
            data = file.read()
            district_list = data.split('\n')

        code_list = []
        for node in district_list:
            if node[10:11] != " ":
                state = node[10:].strip()
            if node[10:11] == " " and node[12:13] != " ":
                city = node[12:].strip()
            if node[10:11] == " " and node[12:13] == " ":
                district = node[14:].strip()
                code = node[0:6]
                addr_dict = {"state": state, "city": city, "district": district, "code": code}
                code_list.append(addr_dict)

        return code_list
