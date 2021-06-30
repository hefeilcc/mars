# -*- coding: UTF-8 -*-
import tornado
from tornado import web
from tornado import gen

from session_handler import SessionHandler
from utils import logger

class RootHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def get(self):
        yield self.init()

    @gen.coroutine
    def init(self):
        session = SessionHandler(self)
        result = session.check_session()
        if result:
            self.render("index.html", account=result["account"])
        else:
            self.render("login.html")
