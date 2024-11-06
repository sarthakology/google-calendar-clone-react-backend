FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 8080
CMD ["npm", "start"]