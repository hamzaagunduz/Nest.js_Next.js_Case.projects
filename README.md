# Nest.js + Next.js Case Project

Bu proje, hem **API (NestJS)** hem de **Client (NextJS)** tarafını içerir. Aşağıdaki adımlarla projeyi bilgisayarınızda çalıştırabilirsiniz.

---

## 1. Reposu Klonla

```bash
git clone https://github.com/hamzaagunduz/Nest.js_Next.js_Case.projects.git
cd Nest.js_Next.js_Case.projects

2. API Kurulumu
2.1 API Bağımlılıklarını Yükle
bash
Kodu kopyala
cd api
npm install

2.2 API Side .env Dosyasını Oluştur
bash
Kodu kopyala
cat > .env <<EOL
PORT=3000
MONGO_URI=mongodb://admin:admin123@localhost:27017/budgetdb?authSource=admin
JWT_SECRET=superSecretKey123
JWT_EXPIRATION=3600s
REFRESH_SECRET=refreshSecret
REFRESH_EXPIRATION=7d
JWT_REFRESH_SECRET=refreshSecretKey123
EOL

MONGO_URI adresini kendi local MongoDB ayarlarınıza göre değiştirin.

2.3 API’yi Çalıştır
bash
Kodu kopyala
npm run start:dev
Swagger dokümantasyonu: http://localhost:3000/api-docs

3. Client Kurulumu
3.1 Client Bağımlılıklarını Yükle
bash
Kodu kopyala
cd ../client
npm install

3.2 Client Side .env.local Dosyasını Oluştur
bash
Kodu kopyala
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" >> .env.local
Client uygulamasının API ile iletişim kurabilmesi için gereklidir.

3.3 Client’ı Çalıştır
bash
Kodu kopyala
npm run dev
NextJS default port: http://localhost:3000 veya terminalde belirtilen port.

4. Özet
API (NestJS): http://localhost:3000


SwaggerApi: http://localhost:3000/api

Client (NextJS): http://localhost:3000 veya terminalde belirtilen port

Artık proje bilgisayarınızda çalışır durumda ve geliştirmeye hazır.

http://localhost:3001/login    Giriş
http://localhost:3001/register    Kayıt
http://localhost:3001/    Dashboard  
http://localhost:3001/expenses Harcamalar
