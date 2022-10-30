FROM node:16.16.0 as base

# Add package file
COPY package.json ./
# COPY yarn.lock ./
# COPY scripts/dev.sh ./scripts/dev.sh

# Install deps
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN yarn build

# Start production image build
# docker pull arm64v8/node:hydrogen-buster-slim
FROM gcr.io/distroless/nodejs:16

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist

# Copy static files
# COPY src/public dist/src/public

# Expose port 3000
EXPOSE 3000
CMD ["dist/server.js"]