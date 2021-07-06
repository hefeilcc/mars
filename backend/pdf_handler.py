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

class PdfHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def post(self, handler):
        try:
            if handler == "download_result":
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
    def pdf2word(self, para):
        logger.debug("request url: %s, para: %s" % (self.request.uri, "too long to show"))
        response = {"errcode": 0, "message": "success"}

        pdf_url = para["pdf_url"]
        pdf_data = para["pdf_data"]

        pdf_file = "/tmp/%s" % uuid.uuid1()
        with open(pdf_file, "wb+") as f:
            f.write(base64.b64decode(pdf_data.split(",")[1]))

        # todo: call api
        result_file = ""

        response["result_file"] = pdf_file
        return response

    @gen.coroutine
    @login_required
    def download_result(self):
        file_name = self.get_body_argument("file_name", "")
        display_name = self.get_body_argument("display_name", "")

        self.set_header("Content-Type", "application/octet-stream")
        self.set_header("Content-Disposition", "attachment;filename={}".format(display_name))
        with open(file_name, "rb") as f:
            self.write(f.read())
