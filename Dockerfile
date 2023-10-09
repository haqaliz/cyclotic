from node:18-alpine as base
WORKDIR /app

COPY package.json .

RUN npm install

COPY src src

EXPOSE 8081

ENTRYPOINT ["node", "src/index.js"]
