# Use an official Node.js runtime as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Cloud Run will use
EXPOSE 8080

# Set the environment variable to production
ENV NODE_ENV=production

# Start the Next.js application on port 8080
CMD ["npm", "start", "--", "-p", "8080"]
