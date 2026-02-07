#!/bin/sh
set -e

npx prisma db push
npm run start