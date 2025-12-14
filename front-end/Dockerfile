FROM node:20-alpine

WORKDIR /app

# Copy package files first (for caching npm install)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of Angular project
COPY . .

# Run Angular dev server
CMD ["sh", "-c", "npx ng serve --host 0.0.0.0 --port 4200"]
