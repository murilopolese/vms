#!/bin/bash

aws s3 sync ./ s3://colorcode2.bananabanana.me/ --exclude '.*' --acl public-read
