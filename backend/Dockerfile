# To build this service, we are using a lightweight Node.js image based on Alpine Linux.
# This keeps our image size small and efficient.

# Then we install our dependencies and copy our application code into the container.

FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npx prisma generate

RUN npx prisma migrate dev

RUN npm run build


EXPOSE 5000

CMD ["npm", "start"]
