FROM node:24-alpine

WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json .

RUN npm install

# Copy the rest of the source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

EXPOSE 5000

CMD ["sh", "./start.sh"]