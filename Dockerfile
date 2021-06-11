FROM node:10.16.0
WORKDIR /App
ADD ./dist/src /App
ADD ./package.json /App
ADD ./.env /App
RUN npm i -P --progress=false
EXPOSE 8000
CMD [ "node", "index.js" ]