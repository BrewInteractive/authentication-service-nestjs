FROM node:14
WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

COPY db ./db
COPY src ./src

RUN npm run build

CMD [ "npm", "run", "start" ]