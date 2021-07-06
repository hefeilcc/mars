# -*- coding: UTF-8 -*-
import json
import random
import time
import uuid
import base64
import traceback
import requests
import tornado
from tornado import web
from tornado import gen

from decorator_handler import login_required
from db.mysql import api as mysql_api
from utils import logger

class OcrHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def post(self, handler):
        try:
            method = getattr(self, handler)
            para = json.loads(self.request.body)
            response = yield method(para)
            self.finish(json.dumps(response))
        except:
            logger.debug(traceback.format_exc())

    @gen.coroutine
    @login_required
    def list_ocr(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        ocr_list = []
        '''
        result = mysql_api.list_person()
        for item in result:
            temp_dict = {
                "id": item.id,
                "id_card": item.id_card,
                "region": item.region,
                "sex": item.sex,
                "age": item.age,
                "phone": item.phone,
                "status": item.status,
                "create_at": item.create_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            ocr_list.append(temp_dict)
        '''
        response["ocr_list"] = ocr_list
        return response

    @gen.coroutine
    @login_required
    def do_ocr(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, "too long to show"))
        response = {"errcode": 0, "message": "success"}

        ocr_url = para["ocr_url"]
        image_data = para["image_data"]

        image_file = "/tmp/%s" % uuid.uuid1()
        with open(image_file, "wb+") as f:
            f.write(base64.b64decode(image_data.split(",")[1]))

        # todo: call api
        result = requests.get("https://www.baidu.com/")
        logger.debug(result.text)

        return response
