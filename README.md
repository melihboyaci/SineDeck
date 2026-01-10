# SineDeck — Dizi & Film Platformu (Full‑Stack)

Bu repo, **NestJS (TypeScript)** ile yazılmış bir REST API ve **React + Vite (TypeScript)** ile yazılmış bir web arayüzünden oluşan “dizi/film platformu” projesidir.

## Proje Yapısı

- `backend-nest-js/` — NestJS API (TypeORM + SQLite), Swagger, JWT auth, dosya yükleme
- `frontend-react/` — React UI (Tailwind + Flowbite), admin ekranları, axios ile API tüketimi
- `screenshots/` — Uygulama ekran görüntüleri

## Özellikler (Özet)

- Film / Dizi yönetimi (CRUD)
- Tür (Genre) yönetimi ve film/diziye tür atama
- Sezon / Bölüm yönetimi (diziler için)
- JWT ile kimlik doğrulama (`/auth/login`, `/auth/register`)
- Rol bazlı yetkilendirme (`admin`, `editor`, `user`)
- Koleksiyonlar: kullanıcı bazlı film/dizi koleksiyonları
- Resim dosyası yükleme ve statik servis (`/files/upload` → `/uploads/...`)
- Swagger API dokümantasyonu: `http://localhost:3000/api`

## Gereksinimler

- Node.js + npm

## Kurulum

### Backend (NestJS)

```bash
cd backend-nest-js
npm install
npm run start:dev
```

- Varsayılan port: `3000` (bkz. `backend-nest-js/src/main.ts`)
- Veritabanı: SQLite dosyası `backend-nest-js/dev.sqlite` (TypeORM `synchronize: true`)
- Yüklenen dosyalar: `backend-nest-js/uploads/` klasörüne kaydedilir ve `/uploads` altında servis edilir.

### Frontend (React)

```bash
cd frontend-react
npm install
npm run dev
```

Frontend API base URL’i şu dosyada sabit tanımlı:

- `frontend-react/src/helper/api.ts` → `baseURL: "http://localhost:3000"`

Backend portu/host’u değişirse burayı güncelleyin.

## Hızlı Kullanım

1. Backend’i ayağa kaldırın: `backend-nest-js` → `npm run start:dev`
2. Frontend’i ayağa kaldırın: `frontend-react` → `npm run dev`
3. Swagger üzerinden endpoint’leri inceleyin: `http://localhost:3000/api`
4. Giriş için token, frontend’de `localStorage` içinde `token` anahtarıyla saklanır.

## Ekran Görüntüleri

> Tüm görseller `screenshots/` klasöründedir.

![Dashboard](screenshots/dashboard.png)
![Movie List](screenshots/movielist.png)
![Movie Detail](screenshots/moviedetail.png)
![Movie Edit](screenshots/movieedit.png)
![Login](screenshots/login.png)

## Notlar

- JWT secret şu dosyada sabit: `backend-nest-js/src/auth/constants.ts` (`SECRET_KEY`). Gerçek ortamda `.env` üzerinden yönetilmesi önerilir.
