# --- Stage 1: Build ứng dụng ---
FROM node:20-alpine AS builder

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Build Next.js ở chế độ production
RUN npm run build

# --- Stage 2: Chạy ứng dụng ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy file build từ stage trước
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY .env .env  
# COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Biến môi trường (nếu cần)
ENV NODE_ENV=production
ENV PORT=3000

# Mở port 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]

