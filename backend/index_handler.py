import os
import sys
import traceback
import tornado
from tornado import web
from tornado import gen

class IndexHandler(web.RequestHandler):
    @web.asynchronous
    @gen.coroutine
    def get(self):
        method = getattr(self, "index")
        yield method()

    @gen.coroutine
    def index(self):
        self.render("index.html")
