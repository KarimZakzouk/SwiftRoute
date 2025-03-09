# Use the official Node.js image as the base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the frontend (if applicable, e.g., for React/Vue)
RUN npm run build

# Expose the port your frontend runs on (adjust if different)
EXPOSE 3000

# Command to start the frontend (adjust based on your framework)
CMD ["npm", "start"]