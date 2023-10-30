FROM node:alpine AS priceloader-worker
WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY .env.docker ./.env
RUN npm install
COPY . .
RUN npm run build
CMD [ "npm","start" ]
