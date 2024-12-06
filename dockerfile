FROM node

RUN mkdir app

WORKDIR /app

COPY package*.json .

RUN npm install

copy . . 

EXPOSE 3000

CMD ["npm", "run", "start"]
