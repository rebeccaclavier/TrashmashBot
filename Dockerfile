FROM node:12

WORKDIR /bot

COPY . /bot

RUN npm install
RUN npm run-script build

CMD [ "npm", "run-script start-prod" ]