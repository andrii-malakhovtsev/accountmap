# Use a slightly more robust image for Prisma
FROM node:24-slim

# Install the engine dependencies Prisma needs
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# 1. Copy package files
COPY package.json package-lock.json* ./

# 2. Copy prisma folder first
COPY prisma ./prisma/

# 3. Install dependencies (Prisma client is generated here)
RUN npm install

# 4. Copy the rest of the code
COPY . .

# 5. Build the app (TS to JS)
RUN npm run build

# RENDER REQUIRES PORT 10000
EXPOSE 10000

CMD npx prisma db push && npm run start