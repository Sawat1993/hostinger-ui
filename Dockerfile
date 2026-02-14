# Stage 1: Build Angular 20
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# COPY Config for Angular 20
# Angular 17+ (including 20) puts files in 'dist/project-name/browser'
# The '*' wildcard automatically matches your project name folder.
COPY --from=build /app/dist/ui/browser /usr/share/nginx/html/

# Create Nginx config for Routing (Fixes 404 errors on refresh)
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]