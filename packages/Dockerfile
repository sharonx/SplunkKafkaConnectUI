FROM mhart/alpine-node

ADD kafka-connect-ui /kafka-connect-ui 
WORKDIR /kafka-connect-ui

RUN npm install -g yarn

EXPOSE 8080

CMD ["yarn", "run", "start:demo"]
