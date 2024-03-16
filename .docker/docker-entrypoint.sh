#!/bin/sh

if [ $# -eq 0 ]; then
  exec uwsgi --ini ./wsgi.ini
else
  exec "$@"
fi

exit $?