# CENG 307 Dönem Sonu Projesi Raporu

## SineDeck - Film ve Dizi Yönetim Platformu

---

**Öğrenci Adı:** Melih Boyacı  
**Öğrenci Numarası:** 22253073  
**Ders:** CENG 307 - Web Tabanlı Teknolojiler  
**Tarih:** 8 Ocak 2026

**Proje Repository Linki:** [Tıklayınız](https://github.com/melihboyaci/SineDeck.git)

---

## İçindekiler

1. [Projenin Amacı ve Kapsamı](#1-projenin-amacı-ve-kapsamı)
2. [Teknoloji Yığını ve Mimari](#2-teknoloji-yığını-ve-mimari)
3. [Kimlik Doğrulama ve Yetkilendirme](#3-kimlik-doğrulama-ve-yetkilendirme)
4. [Veritabanı Tasarımı](#4-veritabanı-tasarımı)
5. [Backend API Dokümantasyonu](#5-backend-api-dokümantasyonu)
6. [Frontend Yapısı ve Component Açıklamaları](#6-frontend-yapısı-ve-component-açıklamaları)
7. [İlişkilerin Frontend Üzerinden Yönetimi](#7-ilişkilerin-frontend-üzerinden-yönetimi)
8. [Kurulum ve Çalıştırma](#8-kurulum-ve-çalıştırma)
9. [Test ve Doğrulama Senaryoları](#9-test-ve-doğrulama-senaryoları)
10. [Sonuç ve Değerlendirme](#10-sonuç-ve-değerlendirme)

---

## 1. Projenin Amacı ve Kapsamı

### 1.1 Proje Tanımı

SineDeck, film ve dizi içeriklerinin yönetilmesini sağlayan kapsamlı bir web uygulamasıdır. Platform, kullanıcıların film ve dizi kütüphanesini görüntülemesine, kendi koleksiyonlarını oluşturmasına ve yöneticilerin içerik yönetimi yapabilmesine olanak tanır.

### 1.2 Çözülen Problemler

- **İçerik Organizasyonu:** Film ve dizilerin türlere göre kategorize edilmesi ve aranabilir hale getirilmesi
- **Hiyerarşik Veri Yönetimi:** Dizilerin sezonlara, sezonların bölümlere ayrılması ve bu hiyerarşinin yönetimi
- **Kişisel Koleksiyonlar:** Kullanıcıların beğendikleri içerikleri gruplayabilmesi
- **Rol Bazlı Erişim Kontrolü:** Farklı kullanıcı rollerine göre yetkilendirme ve içerik yönetimi
- **Ayrı İçerik Yönetimi Panelleri:** Admin ve editörlerin film ve dizi içeriklerini özel yönetim panelleri üzerinden yönetebilmesi

### 1.3 Hedef Kitle

- Film ve dizi meraklıları (standart kullanıcılar)
- İçerik editörleri (yeni içerik ekleme ve düzenleme)
- Sistem yöneticileri (tam yetki ile platform yönetimi)

---

## 2. Teknoloji Yığını ve Mimari

### 2.1 Frontend Teknolojileri

| Teknoloji        | Sürüm   | Kullanım Amacı                           |
| ---------------- | ------- | ---------------------------------------- |
| React            | 19.2.0  | Kullanıcı arayüzü geliştirme             |
| TypeScript       | 5.9.3   | Tip güvenli JavaScript geliştirme        |
| Vite             | 7.2.4   | Hızlı geliştirme sunucusu ve build aracı |
| React Router DOM | 7.11.0  | Sayfa yönlendirme ve navigasyon          |
| Axios            | 1.13.2  | HTTP istek yönetimi                      |
| Tailwind CSS     | 3.4.19  | Utility-first CSS framework              |
| Flowbite React   | 0.12.15 | UI bileşen kütüphanesi                   |
| React Toastify   | 11.0.5  | Bildirim mesajları                       |
| React Icons      | 5.5.0   | İkon kütüphanesi                         |

### 2.2 Backend Teknolojileri

| Teknoloji         | Sürüm  | Kullanım Amacı               |
| ----------------- | ------ | ---------------------------- |
| NestJS            | 11.0.1 | Backend framework            |
| TypeORM           | 0.3.28 | Object-Relational Mapping    |
| SQLite3           | 5.1.7  | Veritabanı                   |
| Passport          | 0.7.0  | Kimlik doğrulama middleware  |
| Passport JWT      | 4.0.1  | JWT tabanlı kimlik doğrulama |
| bcrypt            | 6.0.0  | Şifre hashleme               |
| class-validator   | 0.14.3 | DTO validasyonu              |
| class-transformer | 0.5.1  | Nesne dönüşümü               |
| Swagger           | 11.2.3 | API dokümantasyonu           |
| Multer            | 1.4.5  | Dosya yükleme                |

### 2.3 Genel Mimari Akış

```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐     TypeORM      ┌─────────────────┐
│                 │ ────────────────── │                 │ ──────────────── │                 │
│  React Frontend │     JWT Token      │ NestJS Backend  │     Queries      │  SQLite Database│
│                 │ ◄────────────────► │                 │ ◄──────────────► │                 │
└─────────────────┘                    └─────────────────┘                  └─────────────────┘
        │                                      │
        │                                      │
        ▼                                      ▼
   LocalStorage                          Guards & Pipes
   (Token Saklama)                    (Yetki & Validasyon)
```

**Akış Açıklaması:**

1. Kullanıcı frontend üzerinden işlem başlatır
2. Axios interceptor, localStorage'daki JWT token'ı otomatik olarak request header'ına ekler
3. Backend, gelen isteği JWT Strategy ile doğrular
4. Roles Guard, kullanıcının yetkisini kontrol eder
5. Validation Pipe, gelen veriyi DTO kurallarına göre doğrular
6. Service katmanı iş mantığını uygular ve TypeORM ile veritabanı işlemlerini gerçekleştirir
7. Sonuç frontend'e JSON formatında döner

---

## 3. Kimlik Doğrulama ve Yetkilendirme

### 3.1 Kimlik Doğrulama Akışı

Uygulama JWT (JSON Web Token) tabanlı kimlik doğrulama kullanmaktadır.

**Kayıt Akışı:**

1. Kullanıcı kayıt formunu doldurur (kullanıcı adı, şifre)
2. Frontend şifre validasyonlarını kontrol eder (min 6 karakter, büyük/küçük harf, rakam)
3. Backend şifreyi bcrypt ile hashler (10 tur)
4. Kullanıcı varsayılan "user" rolü ile veritabanına kaydedilir
5. Başarılı kayıt sonrası kullanıcı giriş sayfasına yönlendirilir

**Giriş Akışı:**

1. Kullanıcı giriş formunu doldurur
2. Backend kullanıcı adı ve şifreyi doğrular
3. Doğrulama başarılı ise JWT token oluşturulur (payload: userId, username, role)
4. Token ve kullanıcı bilgileri frontend'e döner
5. Frontend token'ı ve kullanıcı bilgilerini localStorage'a kaydeder
6. Axios interceptor sonraki isteklerde token'ı otomatik ekler

**Token Yapısı:**

- Subject (sub): Kullanıcı ID
- Username: Kullanıcı adı
- Role: Kullanıcı rolü
- Expiration: Token geçerlilik süresi

### 3.2 Kullanıcı Rolleri

Sistemde üç farklı rol tanımlanmıştır:

| Rol        | Açıklama           | Yetkiler                                                                                    |
| ---------- | ------------------ | ------------------------------------------------------------------------------------------- |
| **user**   | Standart kullanıcı | İçerikleri görüntüleme, kişisel koleksiyon oluşturma ve yönetme                             |
| **editor** | İçerik editörü     | User yetkilerine ek olarak: Film, dizi, sezon, bölüm ve tür ekleme/düzenleme                |
| **admin**  | Sistem yöneticisi  | Tüm yetkiler: Editor yetkilerine ek olarak içerik silme, kullanıcı yönetimi, rol değiştirme |

### 3.3 Rol Bazlı Sayfa ve İşlem Ayrımı

**Backend Güvenlik Mekanizması:**

- JWT Strategy: Token doğrulama
- Auth Guard: Oturum kontrolü
- Roles Guard: Rol bazlı yetki kontrolü
- Roles Decorator: Endpoint bazında gerekli rollerin tanımlanması

**Frontend Güvenlik Mekanizması:**

- AuthContext: Oturum durumu yönetimi
- AdminLayout: Oturum kontrolü ve rol bazlı menü gösterimi
- Navigate Component: Yetkisiz kullanıcıları login sayfasına yönlendirme

**Rol Bazlı Menü Yapısı:**

| Menü Öğesi         | User | Editor | Admin |
| ------------------ | ---- | ------ | ----- |
| Ana Sayfa          | ✓    | ✓      | ✓     |
| Filmler            | ✓    | ✓      | ✓     |
| Diziler            | ✓    | ✓      | ✓     |
| Film Yönetimi      | ✗    | ✓      | ✓     |
| Dizi Yönetimi      | ✗    | ✓      | ✓     |
| Tür Yönetimi       | ✗    | ✓      | ✓     |
| Kullanıcı Yönetimi | ✗    | ✗      | ✓     |

---

## 4. Veritabanı Tasarımı

### 4.1 Entity Listesi

Sistemde toplam **7 entity** bulunmaktadır:

| Entity     | Tablo Adı   | Açıklama                       |
| ---------- | ----------- | ------------------------------ |
| User       | users       | Kullanıcı bilgileri ve rolleri |
| Movie      | movies      | Film bilgileri                 |
| Series     | series      | Dizi bilgileri                 |
| Season     | seasons     | Sezon bilgileri                |
| Episode    | episodes    | Bölüm bilgileri                |
| Genre      | genres      | Tür/kategori bilgileri         |
| Collection | collections | Kullanıcı koleksiyonları       |

### 4.2 Entity Detayları

**User Entity:**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | number | Birincil anahtar, otomatik artan |
| username | string | Benzersiz kullanıcı adı |
| password | string | Hashlenmiş şifre |
| role | enum | Kullanıcı rolü (admin/editor/user) |

**Movie Entity:**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | number | Birincil anahtar |
| title | string | Film başlığı |
| director | string | Yönetmen adı |
| releaseYear | number | Vizyon yılı |
| posterUrl | string | Afiş resmi URL (opsiyonel) |
| description | text | Film açıklaması (opsiyonel) |
| genres | Genre[] | İlişkili türler |
| createdAt | Date | Oluşturulma tarihi |
| updatedAt | Date | Güncellenme tarihi |

**Series Entity:**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | number | Birincil anahtar |
| title | string | Dizi başlığı |
| description | text | Dizi açıklaması |
| startYear | number | Başlangıç yılı |
| endYear | number | Bitiş yılı (opsiyonel) |
| creator | string | Yapımcı (opsiyonel) |
| posterUrl | string | Afiş resmi URL (opsiyonel) |
| seasons | Season[] | İlişkili sezonlar |
| genres | Genre[] | İlişkili türler |
| createdAt | Date | Oluşturulma tarihi |
| updatedAt | Date | Güncellenme tarihi |

**Season Entity:**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | number | Birincil anahtar |
| seasonNumber | number | Sezon numarası |
| description | text | Sezon açıklaması (opsiyonel) |
| series | Series | Bağlı olduğu dizi |
| episodes | Episode[] | İlişkili bölümler |
| createdAt | Date | Oluşturulma tarihi |
| updatedAt | Date | Güncellenme tarihi |

**Episode Entity:**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | number | Birincil anahtar |
| title | string | Bölüm başlığı |
| episodeNumber | number | Bölüm numarası |
| description | text | Bölüm açıklaması (opsiyonel) |
| duration | number | Süre (dakika) |
| season | Season | Bağlı olduğu sezon |
| createdAt | Date | Oluşturulma tarihi |
| updatedAt | Date | Güncellenme tarihi |

**Genre Entity:**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | number | Birincil anahtar |
| name | string | Tür adı (benzersiz, max 50 karakter) |
| movies | Movie[] | Bu türe sahip filmler |
| series | Series[] | Bu türe sahip diziler |

**Collection Entity:**
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | number | Birincil anahtar |
| name | string | Koleksiyon adı (max 100 karakter) |
| description | text | Koleksiyon açıklaması (opsiyonel) |
| userId | number | Sahibi olan kullanıcı ID |
| user | User | Koleksiyon sahibi |
| movies | Movie[] | Koleksiyondaki filmler |
| series | Series[] | Koleksiyondaki diziler |
| createdAt | Date | Oluşturulma tarihi |

### 4.3 Entity İlişkileri

#### Bire-Çok (One-to-Many) İlişkiler

| Ana Entity | Bağlı Entity | İlişki Tipi | Cascade Davranışı                            |
| ---------- | ------------ | ----------- | -------------------------------------------- |
| Series     | Season       | 1 → N       | Dizi silinince sezonlar da silinir           |
| Season     | Episode      | 1 → N       | Sezon silinince bölümler de silinir          |
| User       | Collection   | 1 → N       | Kullanıcı silinince koleksiyonlar da silinir |

**İlişki Açıklamaları:**

- Bir **dizi** birden fazla **sezon** içerebilir; her sezon yalnızca bir diziye aittir
- Bir **sezon** birden fazla **bölüm** içerebilir; her bölüm yalnızca bir sezona aittir
- Bir **kullanıcı** birden fazla **koleksiyon** oluşturabilir; her koleksiyon yalnızca bir kullanıcıya aittir

#### Çoka-Çok (Many-to-Many) İlişkiler

| Entity 1   | Entity 2 | Join Tablo           | Açıklama                          |
| ---------- | -------- | -------------------- | --------------------------------- |
| Movie      | Genre    | movies_genres_genres | Filmler ve türler arasında        |
| Series     | Genre    | series_genres_genres | Diziler ve türler arasında        |
| Collection | Movie    | collection_movies    | Koleksiyonlar ve filmler arasında |
| Collection | Series   | collection_series    | Koleksiyonlar ve diziler arasında |

**İlişki Açıklamaları:**

- Bir **film** birden fazla **türe** sahip olabilir; bir **tür** birden fazla **filme** atanabilir
- Bir **dizi** birden fazla **türe** sahip olabilir; bir **tür** birden fazla **diziye** atanabilir
- Bir **koleksiyon** birden fazla **film** ve **dizi** içerebilir; bir içerik birden fazla koleksiyonda bulunabilir

### 4.4 Veritabanı Diyagramı

![Şekil 1: Veritabanı Diyagramı](./screenshots/erd.png)

---

## 5. Backend API Dokümantasyonu

Backend API'si Swagger UI üzerinden de dokümante edilmiştir. Aşağıda tüm endpoint'lerin detaylı açıklamaları yer almaktadır.

### 5.1 Auth (Kimlik İşlemleri) Modülü

| Metot | URL            | Amaç                           | Yetki                         | İstek Alanları                                                       | Dönüş Alanları                          | Hata Durumları                                    |
| ----- | -------------- | ------------------------------ | ----------------------------- | -------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------- |
| POST  | /auth/register | Yeni kullanıcı kaydı           | Herkese açık                  | username (string, min 3 karakter), password (string, min 6 karakter) | id, username, role                      | 400: Validasyon hatası, 409: Kullanıcı adı mevcut |
| POST  | /auth/login    | Kullanıcı girişi               | Herkese açık                  | username (string), password (string)                                 | access_token, user (id, username, role) | 401: Hatalı kullanıcı adı veya şifre              |
| GET   | /auth/profile  | Oturum açmış kullanıcı bilgisi | Giriş yapmış tüm kullanıcılar | -                                                                    | userId, username, role                  | 401: Token geçersiz veya eksik                    |

### 5.2 Users (Kullanıcı Yönetimi) Modülü

| Metot  | URL             | Amaç                      | Yetki        | İstek Alanları                 | Dönüş Alanları                 | Hata Durumları                      |
| ------ | --------------- | ------------------------- | ------------ | ------------------------------ | ------------------------------ | ----------------------------------- |
| GET    | /users          | Tüm kullanıcıları listele | Sadece Admin | -                              | id, username, role (dizi)      | 401: Yetkisiz, 403: Yetersiz yetki  |
| GET    | /users/:id      | Belirli kullanıcıyı getir | Sadece Admin | id (URL parametresi)           | id, username, role             | 401, 403, 404: Kullanıcı bulunamadı |
| PATCH  | /users/:id/role | Kullanıcı rolünü güncelle | Sadece Admin | role (enum: admin/editor/user) | Güncellenmiş kullanıcı bilgisi | 400: Geçersiz rol, 401, 403, 404    |
| DELETE | /users/:id      | Kullanıcıyı sil           | Sadece Admin | id (URL parametresi)           | Silinen kullanıcı bilgisi      | 401, 403, 404                       |

### 5.3 Movies (Filmler) Modülü

| Metot  | URL                | Amaç                      | Yetki         | İstek Alanları                                                                                                           | Dönüş Alanları                                                                                       | Hata Durumları                      |
| ------ | ------------------ | ------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------- |
| GET    | /movies            | Tüm filmleri listele      | Herkese açık  | -                                                                                                                        | Film dizisi (id, title, director, releaseYear, posterUrl, description, genres, createdAt, updatedAt) | -                                   |
| GET    | /movies/:id        | Belirli filmi getir       | Herkese açık  | id (URL parametresi)                                                                                                     | Film detayı (tüm alanlar + genres)                                                                   | 404: Film bulunamadı                |
| POST   | /movies            | Yeni film ekle            | Admin, Editor | title (string, 1-200), director (string, 1-100), releaseYear (1888-2026), posterUrl (opsiyonel), description (opsiyonel) | Oluşturulan film                                                                                     | 400: Validasyon hatası, 401, 403    |
| PATCH  | /movies/:id        | Film bilgilerini güncelle | Admin, Editor | Güncellenecek alanlar (title, director, releaseYear, posterUrl, description)                                             | Güncellenmiş film                                                                                    | 400, 401, 403, 404                  |
| PATCH  | /movies/:id/genres | Filme tür ata             | Admin, Editor | genreIds (number dizisi)                                                                                                 | Güncellenmiş film (genres dahil)                                                                     | 400: Geçersiz tür ID, 401, 403, 404 |
| DELETE | /movies/:id        | Film sil                  | Sadece Admin  | id (URL parametresi)                                                                                                     | Silinen film                                                                                         | 401, 403, 404                       |

### 5.4 Series (Diziler) Modülü

| Metot  | URL                | Amaç                      | Yetki         | İstek Alanları                                                                                                            | Dönüş Alanları                                                                                | Hata Durumları       |
| ------ | ------------------ | ------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------- |
| GET    | /series            | Tüm dizileri listele      | Herkese açık  | -                                                                                                                         | Dizi dizisi (id, title, description, startYear, endYear, creator, posterUrl, genres, seasons) | -                    |
| GET    | /series/:id        | Belirli diziyi getir      | Herkese açık  | id (URL parametresi)                                                                                                      | Dizi detayı (seasons ve genres dahil)                                                         | 404: Dizi bulunamadı |
| POST   | /series            | Yeni dizi ekle            | Admin, Editor | title (string), description (string), startYear (number), endYear (opsiyonel), creator (opsiyonel), posterUrl (opsiyonel) | Oluşturulan dizi                                                                              | 400, 401, 403        |
| PATCH  | /series/:id        | Dizi bilgilerini güncelle | Admin, Editor | Güncellenecek alanlar                                                                                                     | Güncellenmiş dizi                                                                             | 400, 401, 403, 404   |
| PATCH  | /series/:id/genres | Diziye tür ata            | Admin, Editor | genreIds (number dizisi)                                                                                                  | Güncellenmiş dizi (genres dahil)                                                              | 400, 401, 403, 404   |
| DELETE | /series/:id        | Dizi sil                  | Sadece Admin  | id (URL parametresi)                                                                                                      | Silinen dizi                                                                                  | 401, 403, 404        |

### 5.5 Seasons (Sezonlar) Modülü

| Metot  | URL          | Amaç                       | Yetki         | İstek Alanları                                                    | Dönüş Alanları                                                 | Hata Durumları        |
| ------ | ------------ | -------------------------- | ------------- | ----------------------------------------------------------------- | -------------------------------------------------------------- | --------------------- |
| GET    | /seasons     | Tüm sezonları listele      | Herkese açık  | -                                                                 | Sezon dizisi (id, seasonNumber, description, series, episodes) | -                     |
| GET    | /seasons/:id | Belirli sezonu getir       | Herkese açık  | id (URL parametresi)                                              | Sezon detayı                                                   | 404: Sezon bulunamadı |
| POST   | /seasons     | Yeni sezon ekle            | Admin, Editor | seasonNumber (number), description (opsiyonel), seriesId (number) | Oluşturulan sezon                                              | 400, 401, 403         |
| PATCH  | /seasons/:id | Sezon bilgilerini güncelle | Admin, Editor | Güncellenecek alanlar                                             | Güncellenmiş sezon                                             | 400, 401, 403, 404    |
| DELETE | /seasons/:id | Sezon sil                  | Sadece Admin  | id (URL parametresi)                                              | Silinen sezon (bölümler de silinir)                            | 401, 403, 404         |

### 5.6 Episodes (Bölümler) Modülü

| Metot  | URL           | Amaç                       | Yetki         | İstek Alanları                                                                                                | Dönüş Alanları                                                         | Hata Durumları        |
| ------ | ------------- | -------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------- |
| GET    | /episodes     | Tüm bölümleri listele      | Herkese açık  | -                                                                                                             | Bölüm dizisi (id, title, episodeNumber, description, duration, season) | -                     |
| GET    | /episodes/:id | Belirli bölümü getir       | Herkese açık  | id (URL parametresi)                                                                                          | Bölüm detayı                                                           | 404: Bölüm bulunamadı |
| POST   | /episodes     | Yeni bölüm ekle            | Admin, Editor | title (string), episodeNumber (number), description (opsiyonel), duration (number, dakika), seasonId (number) | Oluşturulan bölüm                                                      | 400, 401, 403         |
| PATCH  | /episodes/:id | Bölüm bilgilerini güncelle | Admin, Editor | Güncellenecek alanlar                                                                                         | Güncellenmiş bölüm                                                     | 400, 401, 403, 404    |
| DELETE | /episodes/:id | Bölüm sil                  | Sadece Admin  | id (URL parametresi)                                                                                          | Silinen bölüm                                                          | 401, 403, 404         |

### 5.7 Genres (Türler) Modülü

| Metot  | URL         | Amaç                     | Yetki         | İstek Alanları               | Dönüş Alanları                    | Hata Durumları                     |
| ------ | ----------- | ------------------------ | ------------- | ---------------------------- | --------------------------------- | ---------------------------------- |
| GET    | /genres     | Tüm türleri listele      | Herkese açık  | -                            | Tür dizisi (id, name)             | -                                  |
| GET    | /genres/:id | Belirli türü getir       | Herkese açık  | id (URL parametresi)         | Tür detayı (movies, series dahil) | 404: Tür bulunamadı                |
| POST   | /genres     | Yeni tür ekle            | Admin, Editor | name (string, 1-50 karakter) | Oluşturulan tür                   | 400, 401, 403, 409: Tür adı mevcut |
| PATCH  | /genres/:id | Tür bilgilerini güncelle | Admin, Editor | name (string)                | Güncellenmiş tür                  | 400, 401, 403, 404                 |
| DELETE | /genres/:id | Tür sil                  | Sadece Admin  | id (URL parametresi)         | Silinen tür                       | 401, 403, 404                      |

### 5.8 Collections (Koleksiyonlar) Modülü

| Metot  | URL                    | Amaç                                  | Yetki                                 | İstek Alanları                                                            | Dönüş Alanları                                                       | Hata Durumları     |
| ------ | ---------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------ |
| GET    | /collections           | Kullanıcının koleksiyonlarını listele | Giriş yapmış kullanıcı                | -                                                                         | Koleksiyon dizisi (id, name, description, movies, series, createdAt) | 401                |
| GET    | /collections/:id       | Koleksiyon detayını getir             | Giriş yapmış kullanıcı (sadece kendi) | id (URL parametresi)                                                      | Koleksiyon detayı                                                    | 401, 403, 404      |
| POST   | /collections           | Yeni koleksiyon oluştur               | Giriş yapmış kullanıcı                | name (string, 1-100), description (opsiyonel)                             | Oluşturulan koleksiyon                                               | 400, 401           |
| PATCH  | /collections/:id       | Koleksiyonu güncelle                  | Giriş yapmış kullanıcı (sadece kendi) | name ve/veya description                                                  | Güncellenmiş koleksiyon                                              | 400, 401, 403, 404 |
| DELETE | /collections/:id       | Koleksiyonu sil                       | Giriş yapmış kullanıcı (sadece kendi) | id (URL parametresi)                                                      | Silinen koleksiyon                                                   | 401, 403, 404      |
| POST   | /collections/:id/items | Koleksiyona film/dizi ekle            | Giriş yapmış kullanıcı (sadece kendi) | movieIds (number dizisi, opsiyonel), seriesIds (number dizisi, opsiyonel) | Güncellenmiş koleksiyon                                              | 400, 401, 403, 404 |
| DELETE | /collections/:id/items | Koleksiyondan film/dizi çıkar         | Giriş yapmış kullanıcı (sadece kendi) | movieIds (number dizisi, opsiyonel), seriesIds (number dizisi, opsiyonel) | Güncellenmiş koleksiyon                                              | 400, 401, 403, 404 |

### 5.9 Files (Dosya Yükleme) Modülü

| Metot | URL           | Amaç                     | Yetki        | İstek Alanları                                             | Dönüş Alanları      | Hata Durumları                              |
| ----- | ------------- | ------------------------ | ------------ | ---------------------------------------------------------- | ------------------- | ------------------------------------------- |
| POST  | /files/upload | Dosya yükle (afiş resmi) | Herkese açık | file (multipart/form-data, jpg/jpeg/png/gif/webp, max 5MB) | filename, path, url | 400: Desteklenmeyen format veya boyut aşımı |

---

## 6. Frontend Yapısı ve Component Açıklamaları

### 6.1 Sayfa ve Route Yapısı

| Route                  | Sayfa Componenti | Açıklama                          | Erişim                 |
| ---------------------- | ---------------- | --------------------------------- | ---------------------- |
| /login                 | Login            | Kullanıcı giriş sayfası           | Herkese açık           |
| /register              | Register         | Kullanıcı kayıt sayfası           | Herkese açık           |
| /                      | Dashboard        | Ana sayfa, özet ve koleksiyonlar  | Giriş yapmış kullanıcı |
| /movies                | Movies           | Film listesi ve detay görüntüleme | Giriş yapmış kullanıcı |
| /series                | SeriesPage       | Dizi listesi ve detay görüntüleme | Giriş yapmış kullanıcı |
| /admin/movies          | MovieList        | Film yönetim listesi              | Admin, Editor          |
| /admin/add-movie       | AddMovie         | Yeni film ekleme formu            | Admin, Editor          |
| /admin/edit-movie/:id  | EditMovie        | Film düzenleme formu              | Admin, Editor          |
| /admin/series          | SeriesList       | Dizi, sezon, bölüm yönetimi       | Admin, Editor          |
| /admin/add-series      | AddSeries        | Yeni dizi ekleme formu            | Admin, Editor          |
| /admin/edit-series/:id | EditSeries       | Dizi düzenleme formu              | Admin, Editor          |
| /admin/genres          | GenreManagement  | Tür yönetimi                      | Admin, Editor          |
| /admin/users           | UserManagement   | Kullanıcı yönetimi                | Sadece Admin           |

### 6.2 Layout Componentleri

| Component   | Konum               | Sorumluluk                                                                 | Backend Endpoint |
| ----------- | ------------------- | -------------------------------------------------------------------------- | ---------------- |
| AuthLayout  | components/layouts/ | Giriş ve kayıt sayfaları için minimal düzen, logo ve form container        | -                |
| AdminLayout | components/layouts/ | Ana uygulama düzeni, navbar, rol bazlı menü, oturum kontrolü, çıkış butonu | -                |

### 6.3 Auth Componentleri

| Component   | Konum            | Sorumluluk                                                                | Backend Endpoint |
| ----------- | ---------------- | ------------------------------------------------------------------------- | ---------------- |
| AuthContext | components/auth/ | Oturum durumu yönetimi, login/logout fonksiyonları, localStorage yönetimi | -                |

### 6.4 Sayfa Componentleri

| Component | Konum  | Sorumluluk                                                  | Backend Endpoint                   |
| --------- | ------ | ----------------------------------------------------------- | ---------------------------------- |
| Login     | pages/ | Kullanıcı giriş formu, kimlik doğrulama                     | POST /auth/login                   |
| Register  | pages/ | Kullanıcı kayıt formu, şifre validasyonu                    | POST /auth/register                |
| Dashboard | pages/ | Ana sayfa, son eklenen filmler/diziler, koleksiyon yönetimi | GET /movies, /series, /collections |
| Movies    | pages/ | Film galerisi, arama ve filtreleme, detay modal             | GET /movies, GET /movies/:id       |
| Series    | pages/ | Dizi galerisi, detay modal                                  | GET /series, GET /series/:id       |

### 6.5 Admin Sayfa Componentleri

| Component       | Konum        | Sorumluluk                                                     | Backend Endpoint                                                     |
| --------------- | ------------ | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| MovieList       | pages/admin/ | Film listesi görüntüleme, silme (admin), düzenleme yönlendirme | GET /movies, DELETE /movies/:id                                      |
| AddMovie        | pages/admin/ | Yeni film ekleme formu, tür seçimi, afiş yükleme               | POST /movies, PATCH /movies/:id/genres, POST /files/upload           |
| EditMovie       | pages/admin/ | Film düzenleme formu, mevcut verileri yükleme                  | GET /movies/:id, PATCH /movies/:id, PATCH /movies/:id/genres         |
| SeriesList      | pages/admin/ | Dizi, sezon, bölüm hiyerarşik yönetimi, accordion yapısı       | GET /series, /seasons, /episodes, POST/PATCH/DELETE tüm endpoint'ler |
| AddSeries       | pages/admin/ | Yeni dizi ekleme formu                                         | POST /series, PATCH /series/:id/genres                               |
| EditSeries      | pages/admin/ | Dizi düzenleme formu                                           | GET /series/:id, PATCH /series/:id                                   |
| GenreManagement | pages/admin/ | Tür CRUD işlemleri, tablo görünümü                             | GET/POST/PATCH/DELETE /genres                                        |
| UserManagement  | pages/admin/ | Kullanıcı listesi, rol değiştirme, silme                       | GET /users, PATCH /users/:id/role, DELETE /users/:id                 |

### 6.6 Media Componentleri

| Component        | Konum             | Sorumluluk                                                                                 | Backend Endpoint                              |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------- |
| MediaCard        | components/media/ | Film/dizi kart görünümü, poster, başlık, tür etiketleri, hover efekti                      | -                                             |
| MediaDetailModal | components/media/ | Film/dizi detay modal'ı, poster, bilgiler, türler, sezon/bölüm listesi, koleksiyona ekleme | GET /collections, POST /collections/:id/items |

### 6.7 Collection Componentleri

| Component             | Konum                   | Sorumluluk                                        | Backend Endpoint                                    |
| --------------------- | ----------------------- | ------------------------------------------------- | --------------------------------------------------- |
| CollectionDetailModal | components/collections/ | Koleksiyon içeriği görüntüleme, film/dizi çıkarma | GET /collections/:id, DELETE /collections/:id/items |

### 6.8 Form Componentleri

| Component     | Konum             | Sorumluluk                                                           | Backend Endpoint     |
| ------------- | ----------------- | -------------------------------------------------------------------- | -------------------- |
| GenreSelector | components/forms/ | Çoklu tür seçimi, seçili/mevcut türler, toggle işlevi                | GET /genres          |
| SeasonForm    | components/forms/ | Sezon ekleme/düzenleme formu, validasyon, modal yönetimi             | POST/PATCH /seasons  |
| EpisodeForm   | components/forms/ | Bölüm ekleme/düzenleme formu, validasyon, süre/numara input yönetimi | POST/PATCH /episodes |

### 6.9 UI Componentleri

| Component       | Konum          | Sorumluluk                                     |
| --------------- | -------------- | ---------------------------------------------- |
| Button          | components/ui/ | Stil tutarlılığı için özelleştirilebilir buton |
| FormInput       | components/ui/ | Etiketli ve validasyonlu input alanı           |
| FormTextarea    | components/ui/ | Etiketli çok satırlı metin alanı               |
| FormCard        | components/ui/ | Form container kartı                           |
| Modal           | components/ui/ | Genel amaçlı modal pencere                     |
| ConfirmDialog   | components/ui/ | Onay diyaloğu                                  |
| LoadingSpinner  | components/ui/ | Yükleme göstergesi                             |
| EmptyState      | components/ui/ | Boş durum gösterimi                            |
| PageHeader      | components/ui/ | Sayfa başlığı ve aksiyonlar                    |
| IconButton      | components/ui/ | İkonlu buton                                   |
| PosterUpload    | components/ui/ | Afiş yükleme bileşeni                          |
| PosterThumbnail | components/ui/ | Küçük afiş önizlemesi                          |

<div style="page-break-after: always;"></div>

### 6.10 Ekran Görüntüleri

**Giriş Ekranı:**
![Şekil 2: Giriş Ekranı](./screenshots/login.png)

<br><br><br>

**Kayıt Ekranı:**
![Şekil 3: Kayıt Ekranı](./screenshots/register.png)

<div style="page-break-after: always;"></div>

**Ana Sayfa:**
![Şekil 4: Ana Sayfa](./screenshots/dashboard.png)

<br><br><br>

**Film Listesi:**
![Şekil 5: Film Listesi](./screenshots/movielist.png)

<div style="page-break-after: always;"></div>

**Film Detay Modal:**
![Şekil 6: Film Detay Modal](./screenshots/moviedetail.png)

<br><br><br>

**Film Yönetim Ekranı:**
![Şekil 7: Film Yönetim Ekranı](./screenshots/moviemanagement.png)

<div style="page-break-after: always;"></div>

**Film Ekleme:**
![Şekil 8: Film Ekleme/Düzenleme Modal](./screenshots/movieadd.png)

<br><br><br>

**Film Düzenleme:**
![Şekil 8b: Film Düzenleme Modal](./screenshots/movieedit.png)

<div style="page-break-after: always;"></div>

**Dizi Yönetimi:**
![Şekil 9: Dizi Yönetimi](./screenshots/seriesmanagement.png)

<br><br><br>

**Tür Yönetimi:**
![Şekil 10: Tür Yönetimi](./screenshots/genresmanagement.png)

<div style="page-break-after: always;"></div>

**Kullanıcı Yönetimi:**
![Şekil 11: Kullanıcı Yönetimi](./screenshots/usermanagement.png)

<br><br><br>

**Koleksiyon Detay:**
![Şekil 12: Koleksiyon Detay Modal](./screenshots/collectionsdetail.png)

<div style="page-break-after: always;"></div>

---

## 7. İlişkilerin Frontend Üzerinden Yönetimi

### 7.1 Çoka-Çok İlişki: Film/Dizi ve Türler

**Ekleme İşlemi:**

1. Admin veya Editor "Yeni Film Ekle" veya "Film Düzenle" sayfasına gider
2. Form alanlarını doldurduktan sonra "Türler" bölümüne ulaşır
3. GenreSelector komponenti mevcut türleri API'den çeker ve görüntüler
4. Kullanıcı istediği türlere tıklayarak seçim yapar (çoklu seçim mümkün)
5. Seçili türler mor etiket olarak görünür, seçilmeyenler gri buton olarak kalır
6. Form kaydedildiğinde önce film/dizi oluşturulur, ardından tür ataması ayrı bir istekle yapılır

**Güncelleme İşlemi:**

1. Kullanıcı düzenleme sayfasına gittiğinde mevcut türler otomatik seçili gelir
2. Tür eklemek için gri butonlara, çıkarmak için seçili türün yanındaki X ikonuna tıklanır
3. Kaydet butonuna basıldığında güncel tür listesi backend'e gönderilir

**Silme İşlemi:**

1. Düzenleme formundaki seçili türün X ikonuna tıklanarak ilişki kaldırılır
2. Tür tamamen silindiğinde (Tür Yönetimi üzerinden) tüm film/dizi ilişkileri otomatik temizlenir

### 7.2 Çoka-Çok İlişki: Koleksiyonlar ve İçerikler

**Koleksiyon Oluşturma:**

1. Kullanıcı Dashboard'da "Yeni Koleksiyon" butonuna tıklar
2. Modal açılır, koleksiyon adı ve açıklaması girilir
3. Oluştur butonuna basılarak koleksiyon kaydedilir

**Koleksiyona İçerik Ekleme:**

1. Kullanıcı Filmler veya Diziler sayfasında bir içeriğe tıklar
2. Detay modal'ı açılır
3. Sol üstteki "Koleksiyona Ekle" butonuna tıklar
4. Açılan dropdown'dan mevcut koleksiyonlardan birini seçer
5. Seçilen koleksiyona içerik eklenir ve bildirim gösterilir

**Koleksiyondan İçerik Çıkarma:**

1. Kullanıcı Dashboard'da koleksiyona tıklayarak detay modal'ını açar
2. Koleksiyondaki filmler ve diziler görüntülenir
3. Her içeriğin üzerinde görünen çöp kutusu ikonuna tıklanır
4. Onay sonrası içerik koleksiyondan çıkarılır

**Koleksiyon Silme:**

1. Dashboard'da koleksiyonun yanındaki çöp kutusu ikonuna tıklanır
2. Onay diyaloğu gösterilir
3. Onaylandığında koleksiyon ve tüm içerik ilişkileri silinir

### 7.3 Bire-Çok İlişki: Dizi → Sezon → Bölüm Hiyerarşisi

**Sezon Ekleme:**

1. Admin/Editor Dizi Yönetimi sayfasına gider
2. İlgili dizinin satırına tıklayarak accordion açılır
3. "Sezon Ekle" butonuna tıklar
4. Sezon numarası ve açıklama girilir
5. Kaydedildiğinde sezon ilgili diziye bağlı olarak oluşturulur

**Sezon Düzenleme:**

1. Sezonun yanındaki düzenle ikonuna tıklanır
2. Modal'da mevcut bilgiler güncellenir
3. Kaydet ile değişiklikler uygulanır

**Sezon Silme:**

1. Sezonun yanındaki sil ikonuna tıklanır (sadece Admin)
2. Onay istenir (bağlı bölümler de silinecek uyarısı)
3. Onaylandığında sezon ve tüm bölümleri silinir

**Bölüm Ekleme:**

1. Sezon satırına tıklayarak bölüm listesi görüntülenir
2. "Bölüm Ekle" butonuna tıklanır
3. Bölüm başlığı, numarası, süresi ve açıklaması girilir
4. Kaydedildiğinde bölüm ilgili sezona bağlı olarak oluşturulur

**Bölüm Düzenleme ve Silme:**

1. Bölüm satırındaki ilgili ikonlara tıklanarak işlemler gerçekleştirilir
2. Silme işlemi sadece Admin tarafından yapılabilir

### 7.4 Bire-Çok İlişki: Kullanıcı ve Koleksiyonlar

Bu ilişki otomatik olarak yönetilmektedir:

- Kullanıcı giriş yaptığında JWT token'daki userId kullanılarak koleksiyonları filtrelenir
- Her koleksiyon oluşturulduğunda token'dan alınan userId otomatik olarak atanır
- Kullanıcı sadece kendi koleksiyonlarını görebilir ve yönetebilir

---

## 8. Kurulum ve Çalıştırma

### 8.1 Gereksinimler

| Gereksinim    | Önerilen Sürüm        |
| ------------- | --------------------- |
| Node.js       | 18.x veya üzeri       |
| npm veya yarn | npm 9.x / yarn 1.22.x |
| Git           | 2.x                   |

### 8.2 Backend Kurulumu

1. Proje dizinine gidin ve backend klasörüne geçin
2. Bağımlılıkları yükleyin
3. Geliştirme sunucusunu başlatın
4. Uygulama varsayılan olarak 3000 portunda çalışacaktır
5. Swagger API dokümantasyonuna tarayıcıdan erişebilirsiniz

### 8.3 Frontend Kurulumu

1. Frontend klasörüne geçin
2. Bağımlılıkları yükleyin
3. Geliştirme sunucusunu başlatın
4. Uygulama varsayılan olarak 5173 portunda çalışacaktır

### 8.4 Veritabanı

- SQLite kullanıldığından ayrı veritabanı kurulumu gerekmemektedir
- TypeORM synchronize özelliği ile tablolar otomatik oluşturulur
- Veritabanı dosyası backend dizininde oluşturulur

---

## 9. Test ve Doğrulama Senaryoları

### 9.1 Kullanıcı Kayıt Senaryosu

| Adım | İşlem                                              | Beklenen Sonuç                                |
| ---- | -------------------------------------------------- | --------------------------------------------- |
| 1    | Kayıt sayfasına git                                | Kayıt formu görüntülenir                      |
| 2    | Kısa kullanıcı adı gir (2 karakter)                | Validasyon hatası gösterilir                  |
| 3    | Geçerli kullanıcı adı gir                          | Hata mesajı kaybolur                          |
| 4    | Zayıf şifre gir (sadece küçük harf)                | Şifre kuralları kırmızı görünür               |
| 5    | Güçlü şifre gir (büyük, küçük, rakam, 6+ karakter) | Tüm kurallar yeşile döner                     |
| 6    | Şifreleri uyumsuz gir                              | Eşleşmiyor uyarısı gösterilir                 |
| 7    | Şifreleri eşleştir ve kaydet                       | Başarı bildirimi, giriş sayfasına yönlendirme |

### 9.2 Kullanıcı Giriş Senaryosu

| Adım | İşlem                           | Beklenen Sonuç                            |
| ---- | ------------------------------- | ----------------------------------------- |
| 1    | Giriş sayfasına git             | Giriş formu görüntülenir                  |
| 2    | Yanlış bilgilerle giriş yap     | Hata bildirimi gösterilir                 |
| 3    | Doğru bilgilerle giriş yap      | Başarı bildirimi, ana sayfaya yönlendirme |
| 4    | Navbar'da kullanıcı adı görünür | Kullanıcı adı ve çıkış butonu görünür     |

### 9.3 Rol Bazlı Erişim Senaryosu

| Rol    | Test Edilecek Sayfa | Beklenen Sonuç                                      |
| ------ | ------------------- | --------------------------------------------------- |
| User   | /admin/movies       | Menüde görünmez, doğrudan URL ile erişim engellenir |
| User   | /admin/users        | Menüde görünmez, erişim engellenir                  |
| Editor | /admin/movies       | Erişilebilir, film ekleyebilir, düzenleyebilir      |
| Editor | Film silme butonu   | Görünmez (sadece Admin silebilir)                   |
| Editor | /admin/users        | Menüde görünmez, erişim engellenir                  |
| Admin  | Tüm sayfalar        | Tam erişim, tüm işlemler yapılabilir                |

### 9.4 Film CRUD Senaryosu

| İşlem      | Adımlar                                                     | Beklenen Sonuç                             |
| ---------- | ----------------------------------------------------------- | ------------------------------------------ |
| Oluşturma  | Film Yönetimi → Yeni Film Ekle → Form doldur → Kaydet       | Film listede görünür                       |
| Okuma      | Filmler sayfası → Filme tıkla                               | Detay modal'ı açılır, tüm bilgiler görünür |
| Güncelleme | Film Yönetimi → Düzenle ikonu → Bilgileri değiştir → Kaydet | Değişiklikler listede görünür              |
| Silme      | Film Yönetimi → Sil ikonu (Admin) → Onayla                  | Film listeden kalkar                       |

### 9.5 İlişki Yönetimi Senaryosu

| İlişki          | İşlem                            | Beklenen Sonuç                       |
| --------------- | -------------------------------- | ------------------------------------ |
| Film-Tür        | Film eklerken 3 tür seç          | Film detayında 3 tür etiketi görünür |
| Film-Tür        | Düzenlemede 1 tür çıkar          | Detayda 2 tür görünür                |
| Dizi-Sezon      | Diziye sezon ekle                | Accordion'da sezon görünür           |
| Sezon-Bölüm     | Sezona bölüm ekle                | Sezon altında bölüm görünür          |
| Koleksiyon-Film | Film detayından koleksiyona ekle | Koleksiyon detayında film görünür    |
| Koleksiyon-Film | Koleksiyondan film çıkar         | Film koleksiyondan kalkar            |

### 9.6 Dosya Yükleme Senaryosu

| Adım | İşlem                           | Beklenen Sonuç              |
| ---- | ------------------------------- | --------------------------- |
| 1    | Film ekleme formunda afiş yükle | Afiş önizlemesi görünür     |
| 2    | Desteklenmeyen format yükle     | Hata mesajı gösterilir      |
| 3    | 5MB üzeri dosya yükle           | Boyut hatası gösterilir     |
| 4    | Formu kaydet                    | Afiş film detayında görünür |

---

## 10. Sonuç ve Değerlendirme

### 10.1 Proje Değerlendirmesi

SineDeck projesi, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir film ve dizi yönetim platformudur. NestJS ve React teknolojileri ile geliştirilen platform, JWT tabanlı güvenli kimlik doğrulama, rol bazlı yetkilendirme ve karmaşık ilişkisel veri yapılarını başarıyla yönetmektedir.

Proje aşağıdaki gereksinimleri başarıyla karşılamaktadır:

| Gereksinim              | Durum | Açıklama                                                          |
| ----------------------- | ----- | ----------------------------------------------------------------- |
| Kullanıcı sistemi       | ✓     | Kayıt, giriş, JWT tabanlı oturum yönetimi                         |
| En az 2 rol             | ✓     | 3 rol: Admin, Editor, User                                        |
| Rol bazlı sayfalar      | ✓     | Farklı menüler ve yetki kontrolleri                               |
| En az 4 entity          | ✓     | 7 entity: User, Movie, Series, Season, Episode, Genre, Collection |
| En az 1 bire-çok ilişki | ✓     | Series→Season, Season→Episode, User→Collection                    |
| En az 1 çoka-çok ilişki | ✓     | Movie↔Genre, Series↔Genre, Collection↔Movie, Collection↔Series    |
| Frontend CRUD           | ✓     | Tüm entity'ler için tam CRUD operasyonları                        |
| Versiyon kontrol        | ✓     | [GitHub Repository](https://github.com/melihboyaci/SineDeck.git)  |

---

**Rapor Sonu**
