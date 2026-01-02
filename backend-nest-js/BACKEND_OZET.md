# Backend NestJS - Detaylı Proje Özeti

## 📋 Genel Bilgiler

| Özellik          | Değer                |
| ---------------- | -------------------- |
| Framework        | NestJS 11.x          |
| Dil              | TypeScript           |
| Veritabanı       | SQLite (TypeORM)     |
| Kimlik Doğrulama | JWT (JSON Web Token) |
| Port             | 3000 (default)       |

---

## 🏗️ Proje Mimarisi

```
backend-nest-js/
├── src/
│   ├── main.ts              # Uygulama giriş noktası
│   ├── app.module.ts        # Ana modül (tüm modülleri birleştirir)
│   ├── auth/                # Kimlik doğrulama modülü
│   ├── users/               # Kullanıcı yönetimi modülü
│   ├── movies/              # Film modülü
│   ├── series/              # Dizi modülü
│   ├── seasons/             # Sezon modülü
│   ├── episodes/            # Bölüm modülü
│   └── genres/              # Tür modülü
└── test/                    # E2E testler
```

---

## 📦 Kullanılan Teknolojiler ve Paketler

### Temel Bağımlılıklar

- **@nestjs/common, @nestjs/core** - NestJS çekirdek modülleri
- **@nestjs/typeorm** - TypeORM entegrasyonu
- **@nestjs/jwt** - JWT token yönetimi
- **@nestjs/passport** - Passport.js entegrasyonu
- **passport-jwt** - JWT stratejisi
- **class-validator** - DTO validasyonu
- **class-transformer** - Veri dönüşümü
- **bcrypt** - Şifre hashleme
- **sqlite3** - Veritabanı

---

## 🔐 Kimlik Doğrulama (Auth) Modülü

### Özellikler

- JWT tabanlı kimlik doğrulama
- Bcrypt ile şifre hashleme (10 tur)
- Token süresi: 1 saat
- Rol tabanlı yetkilendirme (RBAC)

### Roller

```typescript
enum UserRole {
  ADMIN = 'admin', // Tam yetki
  EDITOR = 'editor', // Ekleme/Düzenleme yetkisi
  USER = 'user', // Sadece okuma yetkisi
}
```

### API Endpoints

| Method | Endpoint         | Açıklama             | Yetki        |
| ------ | ---------------- | -------------------- | ------------ |
| POST   | `/auth/register` | Yeni kullanıcı kaydı | Herkese açık |
| POST   | `/auth/login`    | Giriş yap, token al  | Herkese açık |
| GET    | `/auth/profile`  | Kullanıcı profili    | JWT gerekli  |

### JWT Strategy

```typescript
// Token Header'dan Bearer olarak okunur
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken();
// Süresi dolmuş tokenler reddedilir
ignoreExpiration: false;
```

### Roles Guard

- `@Roles()` decorator ile endpoint bazlı rol kontrolü
- Reflector kullanılarak metadata okunur
- İzin verilen roller içinde kullanıcının rolü varsa erişim sağlanır

---

## 👤 Users (Kullanıcılar) Modülü

### Entity Yapısı

```typescript
User {
    id: number           // Primary key (auto-increment)
    username: string     // Benzersiz kullanıcı adı
    password: string     // Hashlenmiş şifre
    role: UserRole       // Varsayılan: USER
}
```

### API Endpoints

| Method | Endpoint          | Açıklama                  | Yetki |
| ------ | ----------------- | ------------------------- | ----- |
| GET    | `/users`          | Tüm kullanıcıları listele | ADMIN |
| GET    | `/users/:id`      | Tek kullanıcı getir       | ADMIN |
| PATCH  | `/users/:id/role` | Rol güncelle              | ADMIN |
| DELETE | `/users/:id`      | Kullanıcı sil             | ADMIN |

### Validasyon Kuralları

- **username**: string, min 3 karakter
- **password**: string, min 6 karakter

---

## 🎬 Movies (Filmler) Modülü

### Entity Yapısı

```typescript
Movie {
    id: number           // Primary key
    title: string        // Film adı
    director: string     // Yönetmen
    releaseYear: number  // Yapım yılı (1888-2026)
    posterUrl?: string   // Poster URL (opsiyonel)
    genres: Genre[]      // Türler (ManyToMany)
    createdAt: Date      // Oluşturulma tarihi
    updatedAt: Date      // Güncellenme tarihi
}
```

### API Endpoints

| Method | Endpoint             | Açıklama                  | Yetki         |
| ------ | -------------------- | ------------------------- | ------------- |
| GET    | `/movies`            | Tüm filmleri listele      | Herkese açık  |
| GET    | `/movies/:id`        | Tek film getir (türlerle) | Herkese açık  |
| POST   | `/movies`            | Yeni film ekle            | ADMIN, EDITOR |
| PATCH  | `/movies/:id`        | Film güncelle             | ADMIN, EDITOR |
| PATCH  | `/movies/:id/genres` | Film türlerini ata        | ADMIN, EDITOR |
| DELETE | `/movies/:id`        | Film sil                  | ADMIN         |

### Validasyon Kuralları

- **title**: string, 1-200 karakter
- **director**: string, 1-100 karakter
- **releaseYear**: integer, 1888-2026 arası
- **posterUrl**: URL formatında (opsiyonel)

---

## 📺 Series (Diziler) Modülü

### Entity Yapısı

```typescript
Series {
    id: number           // Primary key
    title: string        // Dizi adı
    description: string  // Açıklama (text)
    startYear: number    // Başlangıç yılı
    endYear?: number     // Bitiş yılı (opsiyonel)
    creator?: string     // Yapımcı (opsiyonel)
    posterUrl?: string   // Poster URL (opsiyonel)
    seasons: Season[]    // Sezonlar (OneToMany, cascade)
    genres: Genre[]      // Türler (ManyToMany)
    createdAt: Date
    updatedAt: Date
}
```

### API Endpoints

| Method | Endpoint             | Açıklama                                          | Yetki         |
| ------ | -------------------- | ------------------------------------------------- | ------------- |
| GET    | `/series`            | Tüm dizileri listele                              | Herkese açık  |
| GET    | `/series/:id`        | Tek dizi getir (sezonlar, bölümler, türler dahil) | Herkese açık  |
| POST   | `/series`            | Yeni dizi ekle                                    | ADMIN, EDITOR |
| PATCH  | `/series/:id`        | Dizi güncelle                                     | ADMIN, EDITOR |
| PATCH  | `/series/:id/genres` | Dizi türlerini ata                                | ADMIN, EDITOR |
| DELETE | `/series/:id`        | Dizi sil                                          | ADMIN         |

### İlişki Detayları

- Dizi silindiğinde sezonları da silinir (`cascade: true`)
- Sezonlar ve bölümler iç içe yüklenir (`relations`)

---

## 📅 Seasons (Sezonlar) Modülü

### Entity Yapısı

```typescript
Season {
    id: number           // Primary key
    seasonNumber: number // Sezon numarası
    description?: string // Açıklama (opsiyonel)
    series: Series       // Ait olduğu dizi (ManyToOne)
    episodes: Episode[]  // Bölümler (OneToMany, cascade)
    createdAt: Date
    updatedAt: Date
}
```

### API Endpoints

| Method | Endpoint       | Açıklama              | Yetki         |
| ------ | -------------- | --------------------- | ------------- |
| GET    | `/seasons`     | Tüm sezonları listele | Herkese açık  |
| GET    | `/seasons/:id` | Tek sezon getir       | Herkese açık  |
| POST   | `/seasons`     | Yeni sezon ekle       | ADMIN, EDITOR |
| PATCH  | `/seasons/:id` | Sezon güncelle        | ADMIN, EDITOR |
| DELETE | `/seasons/:id` | Sezon sil             | ADMIN         |

### Validasyon Kuralları

- **seasonNumber**: integer, zorunlu
- **seriesId**: integer, zorunlu (hangi diziye ait)
- **description**: string (opsiyonel)

### Cascade Davranışları

- Dizi silinirse sezon da silinir (`onDelete: 'CASCADE'`)
- Sezon kaydedilirken bölümler de kaydedilir (`cascade: true`)

---

## 🎞️ Episodes (Bölümler) Modülü

### Entity Yapısı

```typescript
Episode {
    id: number           // Primary key
    title: string        // Bölüm adı
    episodeNumber: number// Bölüm numarası
    description?: string // Açıklama (opsiyonel)
    duration: number     // Süre (dakika)
    season: Season       // Ait olduğu sezon (ManyToOne)
    createdAt: Date
    updatedAt: Date
}
```

### API Endpoints

| Method | Endpoint        | Açıklama              | Yetki         |
| ------ | --------------- | --------------------- | ------------- |
| GET    | `/episodes`     | Tüm bölümleri listele | Herkese açık  |
| GET    | `/episodes/:id` | Tek bölüm getir       | Herkese açık  |
| POST   | `/episodes`     | Yeni bölüm ekle       | ADMIN, EDITOR |
| PATCH  | `/episodes/:id` | Bölüm güncelle        | ADMIN, EDITOR |
| DELETE | `/episodes/:id` | Bölüm sil             | ADMIN         |

### Validasyon Kuralları

- **title**: string, zorunlu
- **episodeNumber**: integer, zorunlu
- **duration**: integer, zorunlu (dakika)
- **seasonId**: integer, zorunlu
- **description**: string (opsiyonel)

---

## 🏷️ Genres (Türler) Modülü

### Entity Yapısı

```typescript
Genre {
    id: number           // Primary key
    name: string         // Tür adı (benzersiz, max 50 karakter)
    movies: Movie[]      // Bu türdeki filmler (ManyToMany)
    series: Series[]     // Bu türdeki diziler (ManyToMany)
}
```

### API Endpoints

| Method | Endpoint      | Açıklama                         | Yetki         |
| ------ | ------------- | -------------------------------- | ------------- |
| GET    | `/genres`     | Tüm türleri listele (A-Z sıralı) | Herkese açık  |
| GET    | `/genres/:id` | Tek tür getir                    | Herkese açık  |
| POST   | `/genres`     | Yeni tür ekle                    | ADMIN, EDITOR |
| PATCH  | `/genres/:id` | Tür güncelle                     | Herkese açık  |
| DELETE | `/genres/:id` | Tür sil                          | ADMIN         |

### Validasyon Kuralları

- **name**: string, 1-50 karakter, benzersiz

### Önemli Özellik

- Aynı isimde tür eklenmeye çalışılırsa `ConflictException` fırlatılır

---

## 🔗 Veritabanı İlişkileri

```
┌─────────────────────────────────────────────────────┐
│                     GENRES                          │
│  (Türler - Film ve Dizilerle ManyToMany)           │
└──────────────┬───────────────────┬──────────────────┘
               │                   │
        ManyToMany          ManyToMany
               │                   │
               ▼                   ▼
┌──────────────────────┐  ┌──────────────────────────┐
│       MOVIES         │  │         SERIES           │
│  (Filmler)           │  │  (Diziler)               │
└──────────────────────┘  └────────────┬─────────────┘
                                       │
                                  OneToMany
                                  (cascade)
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │        SEASONS           │
                          │  (Sezonlar)              │
                          └────────────┬─────────────┘
                                       │
                                  OneToMany
                                  (cascade)
                                       │
                                       ▼
                          ┌──────────────────────────┐
                          │        EPISODES          │
                          │  (Bölümler)              │
                          └──────────────────────────┘
```

---

## 🛡️ Güvenlik Özellikleri

### 1. JWT Kimlik Doğrulama

- Bearer token formatında
- 1 saat geçerlilik süresi
- Payload: `{ username, sub (userId), role }`

### 2. Rol Tabanlı Yetkilendirme (RBAC)

| İşlem              | ADMIN | EDITOR | USER |
| ------------------ | ----- | ------ | ---- |
| Okuma (GET)        | ✅    | ✅     | ✅   |
| Ekleme (POST)      | ✅    | ✅     | ❌   |
| Güncelleme (PATCH) | ✅    | ✅     | ❌   |
| Silme (DELETE)     | ✅    | ❌     | ❌   |
| Kullanıcı Yönetimi | ✅    | ❌     | ❌   |

### 3. Şifre Güvenliği

- Bcrypt ile 10 turda hashleme
- Şifreler veritabanında asla düz metin olarak saklanmaz

### 4. Input Validasyonu

- Tüm DTO'larda `class-validator` dekoratörleri
- `ParseIntPipe` ile tip güvenliği
- Hatalı girişlerde 400 Bad Request döner

---

## 🚀 Çalıştırma Komutları

```bash
# Geliştirme modu (hot-reload)
npm run start:dev

# Üretim build
npm run build

# Üretim modu
npm run start:prod

# Testler
npm run test
npm run test:e2e
npm run test:cov
```

---

## 📝 Örnek API Kullanımları

### Kayıt Olma

```http
POST /auth/register
Content-Type: application/json

{
    "username": "testuser",
    "password": "123456"
}
```

### Giriş Yapma

```http
POST /auth/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "123456"
}

// Response:
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "username": "testuser",
        "role": "user"
    }
}
```

### Film Ekleme (Token gerekli)

```http
POST /movies
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
    "title": "Inception",
    "director": "Christopher Nolan",
    "releaseYear": 2010,
    "posterUrl": "https://example.com/poster.jpg"
}
```

### Filme Tür Atama

```http
PATCH /movies/1/genres
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
    "genreIds": [1, 2, 3]
}
```

### Güncelleme (Update) Örneği

```http
PATCH /series/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
    "description": "Yeni açıklama metni...",
    "posterUrl": "https://yeni-poster.com/img.jpg"
}
```

_Not: Sadece değişmesi istenen alanlar gönderilir (Partial Update)._

---

## ⚠️ Bilinen Notlar

1. **Veritabanı Senkronizasyonu**: `synchronize: true` ayarı aktif - üretimde kapatılmalı
2. **Secret Key**: JWT secret key sabit bir string olarak tanımlı - üretimde environment variable kullanılmalı
3. **Update İşlemleri**: Tüm modüllerde (Movies, Series, Seasons, Episodes, Genres) update metodları implemente edilmiştir ve çalışır durumdadır.

---

## 📊 Özet Tablo

| Modül    | Entity  | DTO'lar                                              | Controller | Service |
| -------- | ------- | ---------------------------------------------------- | ---------- | ------- |
| Auth     | User    | LoginUserDto, CreateUserDto                          | ✅         | ✅      |
| Users    | User    | UpdateRoleDto                                        | ✅         | ✅      |
| Movies   | Movie   | CreateMovieDto, UpdateMovieDto, SetMovieGenresDto    | ✅         | ✅      |
| Series   | Series  | CreateSeriesDto, UpdateSeriesDto, SetSeriesGenresDto | ✅         | ✅      |
| Seasons  | Season  | CreateSeasonDto, UpdateSeasonDto                     | ✅         | ✅      |
| Episodes | Episode | CreateEpisodeDto, UpdateEpisodeDto                   | ✅         | ✅      |
| Genres   | Genre   | CreateGenreDto, UpdateGenreDto                       | ✅         | ✅      |

---

_Bu belge otomatik olarak oluşturulmuştur. Son güncelleme: 30 Aralık 2025_
