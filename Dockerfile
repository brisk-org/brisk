# Use an official Node.js runtime as a parent image

FROM node:20-alpine

# Set the working directory in the container
WORKDIR /workspace/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install the dependencies
# RUN npm i -g yarn

RUN yarn install

# Copy the rest of the application code
COPY . .

EXPOSE 4000

# Start the Node.js application
CMD ["yarn", "build"]
