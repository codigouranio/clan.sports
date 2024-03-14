#!/bin/sh

if [ $# -eq 0 ]; then
  exec uwsgi --ini ./uwsgi.ini
else
  exec "$@"
fi

exit $?