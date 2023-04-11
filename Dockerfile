FROM node:16.16-slim

WORKDIR /app

COPY . .

# update npm
RUN npm install -g npm@latest

#install node dependencies
RUN npm install --production-only

RUN npm install ytdl-core@latest
RUN npm i fent/node-ytdl-core#pull/1203/head

# install ffmpeg
RUN apt-get update -y
RUN apt-get install ffmpeg -y

# create temporary directory
RUN mkdir ./temp
RUN mkdir ./temp/musics
RUN mkdir ./temp/captcha

CMD ["npm", "start"]
