FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and build
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .
RUN npx prisma generate

# Final stage
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 4000
CMD ["npm", "run", "start"]
