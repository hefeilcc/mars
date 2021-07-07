# -*- coding: UTF-8 -*-
import json
import random
import time
import uuid
import base64
import traceback
import tornado
from tornado import web
from tornado import gen

from decorator_handler import login_required
from db.mysql import api as mysql_api
from utils import logger

class DocHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def post(self, handler):
        try:
            if handler == "download":
                method = getattr(self, handler)
                yield method()
                self.finish()
            else:
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

        doc_list = []
        result = mysql_api.list_doc()
        for item in result:
            if item.update_at:
                update_time = item.update_at.strftime("%Y-%m-%d %H:%M:%S")
            else:
                update_time = item.create_at.strftime("%Y-%m-%d %H:%M:%S")

            temp_dict = {
                "id": item.id,
                "category": item.category,
                "title": item.title,
                "file_path": item.file_path,
                "sharer": item.sharer,
                "update_at": update_time,
            }
            doc_list.append(temp_dict)

        response["doc_list"] = doc_list
        return response

    @gen.coroutine
    @login_required
    def create(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, "too long to show"))
        response = {"errcode": 0, "message": "success"}

        file_data = para["file_data"]
        file_type = file_data.split(";")[0].split("/")[1]
        file_path = "/opt/docs/%s.%s" % (uuid.uuid1(), file_type)
        with open(file_path, "wb+") as f:
            f.write(base64.b64decode(file_data.split(",")[1]))

        para["file_path"] = file_path
        mysql_api.create_doc(para)

        return response

    @gen.coroutine
    @login_required
    def update(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, "too long to show"))
        response = {"errcode": 0, "message": "success"}

        id = para["id"]
        category = para["category"]
        title = para["title"]
        file_data = para["file_data"]
        file_path = ""

        if file_data:
            file_type = file_data.split(";")[0].split("/")[1]
            file_path = "/opt/docs/%s.%s" % (uuid.uuid1(), file_type)
            with open(file_path, "wb+") as f:
                f.write(base64.b64decode(file_data.split(",")[1]))

        mysql_api.update_doc(id, category, title, file_path)

        return response

    @gen.coroutine
    @login_required
    def delete(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, para))
        response = {"errcode": 0, "message": "success"}

        id_list = para["id_list"]
        mysql_api.delete_doc(id_list)

        return response

    @gen.coroutine
    @login_required
    def download(self):
        doc_id = self.get_body_argument("doc_id", "")
        db_doc = mysql_api.get_doc(doc_id)

        file_name = db_doc.file_path
        display_name = file_name.split("/")[-1]

        self.set_header("Content-Type", "application/octet-stream")
        self.set_header("Content-Disposition", "attachment;filename={}".format(display_name))
        with open(file_name, "rb") as f:
            self.write(f.read())
