FROM node:20.10.0

WORKDIR /app

# RUN apk update && \
#     apk add --no-cache python3 make g++ & \
#     ln -sf /usr/bin/python3 /usr/bin/python

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]