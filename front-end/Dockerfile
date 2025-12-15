FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Angular dev server port
EXPOSE 4201

# Start Angular dev server
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4201"]
