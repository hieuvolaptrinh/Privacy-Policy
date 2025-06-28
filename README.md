# Template - Privacy Policy & Data Deletion Service

Dự án này bao gồm trang Privacy Policy và Facebook Data Deletion Callback endpoint cho ứng dụng để bạn tham khảo

## 📁 Cấu trúc thư mục

```
PrivacyPolicy/
├── privacy-policy.html     # Trang chính sách bảo mật
├── fb-data-deletion.js     # Backend endpoint xóa dữ liệu Facebook
├── package.json           # Dependencies và scripts
├── README.md             # File hướng dẫn này
└── .env.example          # Template file environment variables
```

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

### 3. Chạy production server

```bash
npm start
```

## 🌐 Endpoints

### Backend Endpoints

- **POST `/fb-data-deletion`** - Facebook Data Deletion Callback
- **GET `/health`** - Health check endpoint  
- **GET `/`** - Service information
- **GET `/privacy-policy`** - Privacy policy redirect

### Static Files

- **`/privacy-policy.html`** - Trang chính sách bảo mật

## 📋 Yêu cầu Facebook

### 1. Privacy Policy URL
```
https://yourdomain.com/privacy-policy.html
```

### 2. Data Deletion Callback URL
```
https://yourdomain.com/fb-data-deletion
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration (tùy chọn theo database bạn sử dụng)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthy_store
DB_USER=your_db_user
DB_PASS=your_db_password

# Logging
LOG_LEVEL=info
```

### SSL/HTTPS Configuration

Facebook yêu cầu endpoint phải chạy trên HTTPS. Bạn có thể sử dụng:

1. **Reverse Proxy (Nginx/Apache)**
2. **Load Balancer (AWS ALB, GCP LB)**
3. **CDN (Cloudflare)**
4. **SSL Certificate (Let's Encrypt)**

Ví dụ Nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 💾 Database Integration

### Cần implement trong `fb-data-deletion.js`:

```javascript
// Ví dụ với MongoDB
async function deleteUserData(userId) {
    await User.findOneAndDelete({ facebookId: userId });
    await UserProfile.deleteMany({ userId: userId });
    await Orders.deleteMany({ userId: userId });
    // ... xóa các collection khác
}

// Ví dụ với MySQL/PostgreSQL  
async function deleteUserData(userId) {
    await db.query('DELETE FROM users WHERE facebook_id = ?', [userId]);
    await db.query('DELETE FROM orders WHERE user_id = ?', [userId]);
    // ... xóa các bảng khác
}
```

## 🧪 Testing

### Test Data Deletion Endpoint

```bash
curl -X POST https://yourdomain.com/fb-data-deletion \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_facebook_user_id",
    "challenge": "test_challenge_string"
  }'
```

Expected Response:
```json
{
  "url": "https://yourdomain.com/fb-data-deletion",
  "confirmation_code": "test_challenge_string"
}
```

### Test Health Check

```bash
curl https://yourdomain.com/health
```

## 📊 Monitoring & Logging

Recommend thêm logging service:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});
```

## 🔒 Security Best Practices

1. **HTTPS Only** - Facebook yêu cầu bắt buộc
2. **Input Validation** - Validate user_id và challenge
3. **Rate Limiting** - Chống spam/abuse
4. **Error Handling** - Không expose sensitive information
5. **Logging** - Log tất cả deletion requests
6. **Database Backup** - Backup trước khi xóa (optional)

## 🚀 Deployment

### Option 1: VPS/Server

```bash
# Upload files to server
scp -r PrivacyPolicy/ user@yourserver:/var/www/

# Install dependencies
cd /var/www/PrivacyPolicy
npm install --production

# Start with PM2
pm2 start fb-data-deletion.js --name "privacy-service"
```

### Option 2: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Option 3: Cloud Platforms

- **Heroku**: `git push heroku main`
- **AWS Elastic Beanstalk**: Upload ZIP file
- **Google Cloud Run**: Deploy container
- **Digital Ocean App Platform**: Connect GitHub repo

## 📞 Support

Nếu có vấn đề, liên hệ:
- Email: vndhieuak@gmail.com

