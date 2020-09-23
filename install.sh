#!/bin/sh

set -x

ps -ef | grep -w mars.py | grep -v grep | awk '{print $2}' | xargs kill >/dev/null 2>&1

rm -rf /opt/mars
cp -rf ../mars /opt

python -u /opt/mars/mars.py
