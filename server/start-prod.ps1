$env:NODE_ENV = "production"
$env:MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority"
$env:JWT_SECRET = "fc5c01210b133afeb2c293bfd28c59df3bb9d3b272999be0eb838c930b1419fd"
$env:JWT_EXPIRES_IN = "7d"
$env:SMTP_HOST = "smtp-relay.brevo.com"
$env:SMTP_PORT = "587"
$env:SMTP_SECURE = "false"
$env:SMTP_USER = "88ccee002@smtp-brevo.com"
$env:SMTP_PASSWORD = "myFchwr5H6AYtJdq"
$env:SMTP_FROM = "88ccee002@smtp-brevo.com"
$env:CINETPAY_APIKEY = "8175507286818e7d93c3e80.85879970"
$env:CINETPAY_SITE_ID = "105894194"
$env:CINETPAY_SECRET_KEY = "782120606818e842c196f0.72843773"

npm run build
if ($?) {
    npm start
} 