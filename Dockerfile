# FROM node:22
# WORKDIR /app
# COPY package*.json ./
# RUN npm i
# COPY . .
# EXPOSE 8080
# CMD ["npm", "start"]
FROM node:22

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose the port
EXPOSE 8080

CMD [ "npm", "start" ]