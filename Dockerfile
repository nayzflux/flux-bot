FROM node:16.16-slim

WORKDIR /app

COPY . .

# update npm
RUN npm install -g npm@latest

#install node dependencies
RUN npm install --production-only

# RUN npm install ytdl-core@4.9.1

RUN apt-get install yt-dlp

# install ffmpeg
RUN apt-get update -y
RUN apt-get install ffmpeg -y

# create temporary directory
RUN mkdir ./temp
RUN mkdir ./temp/musics
RUN mkdir ./temp/captcha

CMD ["npm", "start"]
