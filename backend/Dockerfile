FROM node

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client

COPY backend/package.json backend/yarn.lock ./
RUN yarn install

COPY backend .

RUN yarn prisma generate
RUN yarn build

COPY backend/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
