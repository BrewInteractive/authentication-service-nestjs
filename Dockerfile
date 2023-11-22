FROM node:21

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

COPY db ./db
COPY src ./src

RUN npm run build

RUN addgroup --system nonroot \
    && adduser --system nonroot --ingroup nonroot

USER nonroot

CMD [ "npm", "run", "start" ]