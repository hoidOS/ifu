FROM node:22-alpine

RUN addgroup app && adduser -S -G app app

USER app

WORKDIR /app

# Copy lockfile and package.json for efficient layer caching
COPY package*.json ./

USER root
RUN chown -R app:app .
USER app

# Install dependencies with npm
RUN npm ci

# Copy the rest of the source
COPY . .

# Build the Next.js application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
