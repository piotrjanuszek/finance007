# Use a Node.js image as the base
FROM node:18-alpine

WORKDIR /application

COPY package*.json .
# Install dependencies
RUN npm install

# Expose the development server port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]