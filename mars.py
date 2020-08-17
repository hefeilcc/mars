import sys
import traceback
import tornado

settings = {
}

application = tornado.web.Application([
    (r"/", index_handler),
], **settings)

def start():
    try:
        sockets = tornado.netutil.bind_sockets(9000)
        tornado.process.fork_processes(0)
        server = tornado.httpserver.HTTPServer(application)
        server.add_sockets(sockets)

        print("mars process start...")
        tornado.ioloop.IOLoop.current().start()

    except:
        print("mars start failed: %s" % traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    start()
