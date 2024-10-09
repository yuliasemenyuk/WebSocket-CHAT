FROM node:18-bullseye
WORKDIR /app
ADD package.json /app/
RUN npm install --global typescript
RUN npm install
COPY . .
RUN tsc
CMD ["node", "dist/app.js"]
EXPOSE 3002
