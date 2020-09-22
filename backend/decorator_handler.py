# -*- coding: UTF-8 -*-
import os
import sys
import traceback
import uuid
import json
import random
import time
import tornado
from tornado import web
from tornado import gen
from functools import wraps
from session_handler import SessionHandler

def login_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        http_request = args[0]
        session = SessionHandler(http_request)
        if session.check_session():
            return func(*args, **kwargs)
        else:
            return {"errcode": 100, "message": "login_required fail"}

    return decorated
