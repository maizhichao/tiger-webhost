FROM node:8

WORKDIR /home/node/tiger

EXPOSE 8080

COPY . /home/node/tiger

CMD ["npm", "run", "prod"]
