# Use a slightly more robust image for Prisma
FROM node:24-slim

# Install the engine dependencies Prisma needs
RUN apt-get update -y && apt-get install -y openssl libssl-dev ca-certificates

WORKDIR /app

# 1. Copy package files
COPY package.json package-lock.json* ./

# 2. Copy prisma folder first
COPY prisma ./prisma/

# 3. Install dependencies
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Generate Prisma Client explicitly for the container OS
RUN npx prisma generate

# 6. Build the app (TS to JS)
RUN npm run build

# RENDER REQUIRES PORT 10000
EXPOSE 10000

# Push schema changes and start the app
CMD npx prisma db push && npm run start