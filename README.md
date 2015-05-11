# WRK Debugging Environment

This project can help you understand [wrk's](https://github.com/wg/wrk) scripting capabilities.

It consists of:

- the application container
- the wrk container used for debugging

The application uses [Express](http://expressjs.com/) framework and is based on the [Node.js](https://nodejs.org/) platform. It is very simple. It returns an `200` status code for all requests and logs each request details into the console.

A sample request:

    curl -i -XPOST http://app:3000/test?test=true -d 'test'

Would return:

    HTTP/1.1 200 OK
    X-Powered-By: Express
    X-Debug: true
    Content-Type: text/html; charset=utf-8
    Content-Length: 2
    ETag: W/"2-79dcdd47"
    Date: Mon, 11 May 2015 00:18:58 GMT
    Connection: keep-alive

Additionally the application would log:

    --- --- --- --- --- --- --- --- --- --- --- --- ---
    
    [2015-05-11 00:18:58] Request 2983
    
    POST/1.1 /test?test=true on :::3000
    
    Headers:
     - user-agent: curl/7.38.0
     - host: app:3000
     - accept: */*
     - content-length: 4
     - content-type: application/x-www-form-urlencoded
    
    No cookies
    
    Body:
    test

## Requirements:

- [Docker](http://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup

To start the environment use this command:

    docker-compose run --rm wrk bash

It will spin up the application container and a container with wrk.

Now inside the wrk container use the following command to benchmark the application:

    wrk -c3 -d1s -t2 -s /scripts/debug.lua http://app:3000 -- debug true

Use the `debug.lua` file to print debugging messages.

Leave the wrk container with `exit`.