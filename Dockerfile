# Use the official Node.js image as the base image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm run build

EXPOSE 80

CMD ["npm", "start"]
