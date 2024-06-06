#!/bin/bash
docker buildx build --platform linux/amd64 --load --tag kurtyoon/ownsaemiro-nft:0.0.1 .
docker push kurtyoon/ownsaemiro-nft:0.0.1
