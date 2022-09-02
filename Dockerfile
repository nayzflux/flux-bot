FROM node:16.16-slim

WORKDIR /app

COPY . .

#install node dependencies
RUN npm install --production-only

# install ffmpeg
RUN apt-get update -y
RUN apt-get install ffmpeg -y

# create temporary directory
RUN mkdir ./temp
RUN mkdir ./temp/musics
RUN mkdir ./temp/captcha

CMD ["npm", "start"]