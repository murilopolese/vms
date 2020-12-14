#!/bin/bash

aws s3 sync ./dist/ s3://splatycode.bananabanana.me/ --exclude '.*' --acl public-read
