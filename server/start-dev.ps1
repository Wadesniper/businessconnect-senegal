# Configuration des variables d'environnement
$env:NODE_ENV = "development"
$env:MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority"
$env:JWT_SECRET = "businessconnect-senegal-2025-secret-key"
$env:JWT_EXPIRES_IN = "7d"
$env:SMTP_HOST = "smtp-relay.brevo.com"
$env:SMTP_PORT = "587"
$env:SMTP_USER = "babacar@businessconnect.sn"
$env:SMTP_PASS = "xsmtpsib-0123456789abcdef-ghijklmn"
$env:SMTP_FROM = "BusinessConnect Senegal <noreply@businessconnect.sn>"
$env:CINETPAY_APIKEY = "123456789abcdef"
$env:CINETPAY_SITE_ID = "123456789"
$env:CINETPAY_BASE_URL = "https://api-checkout.cinetpay.com/v2/payment"
$env:CINETPAY_RETURN_URL = "https://businessconnectsenegal.com/payment/return"
$env:CINETPAY_NOTIFY_URL = "https://businessconnect-senegal-api-production.up.railway.app/api/subscriptions/notify"
$env:API_URL = "http://localhost:5000"
$env:CLIENT_URL = "http://localhost:3000"

# Démarrage du serveur
npm run dev 