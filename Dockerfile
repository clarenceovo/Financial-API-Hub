FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 9888
ENTRYPOINT  [ "node", "app.js" ]