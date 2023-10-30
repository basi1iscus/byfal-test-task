FROM node:alpine AS priceloader-controller
WORKDIR /app
EXPOSE 8080/tcp
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . .
ENV WS_HOST=0.0.0.0
ENV WS_PORT=8080
RUN npm run build
CMD [ "npm","start" ]
