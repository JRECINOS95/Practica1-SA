FROM node:10.16.0
WORKDIR /App
ADD ./dist /App
ADD ./package.json /App
RUN npm i -P --progress=false
EXPOSE 8000
CMD [ "node", "index.js" ]