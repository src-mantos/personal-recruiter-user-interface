FROM node:16-alpine

# HACK: consider packaging a types release for data-service
RUN apk --no-cache add git

RUN mkdir /home/suite
RUN mkdir /home/suite/personal-recruiter-user-interface

WORKDIR /home/suite
RUN git clone https://github.com/src-mantos/personal-recruiter-data-service.git

WORKDIR /home/suite/personal-recruiter-data-service
RUN yarn install
RUN yarn build

WORKDIR /home/suite/personal-recruiter-user-interface
COPY . ./

RUN yarn install

EXPOSE 8080
CMD [ "yarn", "run", "dev" ]