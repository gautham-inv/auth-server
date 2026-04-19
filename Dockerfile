FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and build
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm install

COPY . .
# npx prisma generate is handled by npm install (postinstall)

# Final stage
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 4000
CMD ["npm", "run", "start"]
