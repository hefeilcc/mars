# -*- coding: UTF-8 -*-
import json
import random
import time
import traceback
import tornado
from tornado import web
from tornado import gen

from decorator_handler import login_required
from db.mysql import api as mysql_api
from utils import logger

class SbaiduHandler(web.RequestHandler):
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
    def list(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        sbaidu_list = []
        result = mysql_api.list_sbaidu()
        for item in result:
            if item.update_at:
                update_time = item.update_at.strftime("%Y-%m-%d %H:%M:%S")
            else:
                update_time = item.create_at.strftime("%Y-%m-%d %H:%M:%S")

            temp_dict = {
                "id": item.id,
                "category": item.category,
                "question": item.question,
                "solution": item.solution,
                "sharer": item.sharer,
                "remark": item.remark,
                "update_at": update_time,
            }
            sbaidu_list.append(temp_dict)

        response["sbaidu_list"] = sbaidu_list
        return response

    @gen.coroutine
    @login_required
    def create(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        mysql_api.create_sbaidu(para)

        return response

    @gen.coroutine
    @login_required
    def update(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        id = para["id"]
        category = para["category"]
        question = para["question"]
        solution = para["solution"]
        remark = para["remark"]
        mysql_api.update_sbaidu(id, category, question, solution, remark)

        return response

    @gen.coroutine
    @login_required
    def delete(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        id_list = para["id_list"]
        mysql_api.delete_sbaidu(id_list)

        return response
