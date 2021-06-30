# -*- coding: UTF-8 -*-
import os
import sys
import traceback
import logging
import tornado
import tornado.process
import tornado.httpserver

from backend import root_handler
from backend import auth_handler
from backend import person_handler
from backend import sbaidu_handler
from backend.utils import logger

def make_app():
    current_path = os.path.dirname(__file__)
    
    settings = {
        "template_path": os.path.join(current_path, "frontend/template"),
        "static_path": os.path.join(current_path, "frontend/static"),
        "cookie_secret": "d13b9a02-36a7-4951-b9bd-153f5fc93e4e",
    }

    app = tornado.web.Application([
        (r"/", root_handler.RootHandler),
        (r"/auth/(.*)", auth_handler.AuthHandler),
        (r"/person/(.*)", person_handler.PersonHandler),
        (r"/sbaidu/(.*)", sbaidu_handler.SbaiduHandler),
    ], **settings)

    app.current_path = current_path

    return app

def start():
    try:
        logging.getLogger("tornado.general").disabled = True
        logging.getLogger("tornado.application").disabled = True
        logging.getLogger("tornado.access").disabled = True

        sockets = tornado.netutil.bind_sockets(80)
        tornado.process.fork_processes(0)
        server = tornado.httpserver.HTTPServer(make_app())
        server.add_sockets(sockets)

        logger.debug("mars process start...")
        tornado.ioloop.IOLoop.instance().start()

    except:
        logger.debug("mars start failed: %s" % traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    start()
