#!/bin/sh

if [ $# -eq 0 ]; then
  exec flask run
else
  exec "$@"
fi

exit $?