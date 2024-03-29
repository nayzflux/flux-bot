FROM node:16.16-slim

WORKDIR /app

COPY . .

# update npm
RUN npm install -g npm@latest

#install node dependencies
RUN npm install --production-only

# RUN npm install ytdl-core@4.9.1

# install ffmpeg
RUN apt-get update -y
RUN apt-get install ffmpeg -y

# install YT-DLP
RUN apt install python -y
RUN apt install curl -y
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp
# RUN apt-get install yt-dlp

# create temporary directory
RUN mkdir ./temp
RUN mkdir ./temp/musics
RUN mkdir ./temp/captcha

CMD ["npm", "start"]
