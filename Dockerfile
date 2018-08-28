FROM node:alpine

RUN apk add --no-cache tzdata

# Commands will run in this directory
WORKDIR /app

# Install app dependencies
COPY package.json /app
RUN yarn install

# Add all our code inside that directory that lives in the container
ADD . /app

# Set environment variables
ENV NODE_ENV production

# The command to run our app when the container is run
CMD ["yarn", "start"]
