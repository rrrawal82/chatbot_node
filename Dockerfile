FROM  node:18-alpine
WORKDIR /app

#install app dependencies
COPY package*.json ./

#run npm install
RUN npm install

#Bundle app source
COPY . .

EXPOSE  8080

CMD [ "npm" ,"start" ]



