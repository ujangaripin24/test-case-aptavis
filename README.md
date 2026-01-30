# Test Case PT. Digital Apta Media

## Stack/Teknologi yang digunakan
* Laravel 12 & React 19
* PHP versi 8.2
* Node versi 20.19.4 (LTS)
* TypeScript
* Inertia
* MySQL (MariaDB Server versi 10.4.16)
* Tailwind
* Flowbite & Flowbite-React
* React-Icons

## Intruksi Instalisasi
### 1. Clone & Install Dependencies
```
git clone https://github.com/ujangaripin24/test-case-aptavis
cd test-case-aptavis
composer install
npm install
```
### 2. Konfigurasi Environment
```
cp .env.example .env
php artisan key:generate
```
### 3. Setup Database
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db-test-case-aptavis
DB_USERNAME=root
DB_PASSWORD=necronomiconbookofdeadlevel123!@#
```

### 4. Migrasi & Seed
```
php artisan migrate
```

### 5. Jalankan Backend
```
php artisan serve
```

### 6. Jalankan Frontend
```
npm run dev
```

### 7. Buka di browser
```
http://127.0.0.1:8000
```

## Task
### 1. Task Dependency [DONE]
- Setiap task dapat memiliki satu atau lebih dependency ke task lain. Task tidak dapat berubah ke status Done jika salah satu dependency belum Done.
- Sistem harus mencegah circular dependency (langsung maupun tidak langsung).
- Perubahan status dependency harus memicu validasi ulang pada task yang bergantung.

### 2. Project Dependency [DONE]
- Project dapat memiliki dependency ke project lain.
- Project tidak dapat berstatus In Progress atau Done jika dependency project belum Done.
- Jika status project dependency berubah (misalnya dari Done ke In Progress), maka: status project yang bergantung harus ikut terpengaruh sesuai aturan.
- Circular dependency antar project harus ditolak oleh sistem

### 3. Filtering Termasuk Subtask [DONE]
Task dapat memiliki hierarki (parent–child / subtask).
Filtering harus mendukung:
- status task termasuk seluruh subtask di bawahnya
- pencarian task yang:
	- match di parent atau
	- match di subtask

Hasil filtering harus konsisten secara hierarkis:
- jika subtask match, parent tetap ditampilkan (meskipun parent tidak match)

### 4. Project Schedule (Non-Intersecting) [DONE]
Setiap project memiliki:
- start_date
- end_date
Tidak boleh ada dua project dengan jadwal yang saling beririsan.
Validasi harus berlaku untuk:
- create
- update
Jika terjadi konflik jadwal:
- sistem harus menolak perubahan
- dan memberikan informasi project mana yang menyebabkan konflik.
## Tambahan
* PWA (Single Page Application) [DONE]
  * Laravel via XHR (Ajax)
* Modal atau Sliding Container [DONE]
  * Pakai Drawer dari Flowbite-React
* Real Time Data Manipulation [DONE]
  * Laravel via XHR (Ajax) & React DOM