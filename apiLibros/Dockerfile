FROM node:10.16.0
WORKDIR /App
ADD ./dist/src /App
ADD ./package.json /App
ADD ./.env /App
RUN npm i -P --progress=false
RUN mkdir /tmp/archivos_libros_sa
EXPOSE 8000
CMD [ "node", "index.js" ]