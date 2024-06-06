#!/bin/bash
docker buildx build --platform linux/amd64 --load --tag kurtyoon/ownsaemiro-nft:0.0.1 .
docker push kurtyoon/ownsaemiro-nft:0.0.1

#!/bin/bash
docker stop ownsaemiro-blockchcain
docekr rm ownsaemiro-blockchain
docker rmi kurtyoon/ownsaemiro-nft:0.0.1
docker pull kurtyoon/ownsaemiro-nft:0.0.1
dcoker run -d -p 3000:3000 --network ownsaemiro-bridge --name ownsaemiro-blockchain kurtyoon/ownsaemiro-nft:0.0.1