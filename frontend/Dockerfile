# To build this service, we are using a lightweight Node.js image based on Alpine Linux.
# This keeps our image size small and efficient.

# Then we install our dependencies and copy our application code into the container.

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
