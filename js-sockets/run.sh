#!/usr/bin/env bash

docker run -it --rm --network host http-get-perf-js-sockets "$@"
