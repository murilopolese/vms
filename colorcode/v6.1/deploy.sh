#!/bin/bash

aws s3 sync ./ s3://colorcode.bananabanana.me/ --exclude '.*' --acl public-read
