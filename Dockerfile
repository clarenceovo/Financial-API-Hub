FROM node:10-alpine
mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
COPY package*.json ./
USER node
RUN npm install
EXPOSE 9888
CMD [ "node", "app.js" ]