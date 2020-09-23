# -*- coding: UTF-8 -*-
import redis

redis_pool = redis.ConnectionPool(host="localhost")
redis_client = redis.StrictRedis(connection_pool=redis_pool)

session_prefix = "session_"
session_expire = 600

def get_session(session_id):
    session_name = session_prefix + session_id
    return redis_client.get(session_name)

def save_session(session_id, session_content, expired_time=session_expire):
    session_name = session_prefix + session_id
    redis_client.setex(session_name, expired_time, session_content)

def update_session(session_id):
    redis_client.expire(session_id, session_expire)
