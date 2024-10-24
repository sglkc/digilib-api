<div align=center>
  <h1>digilib-api</h1>
  <p><strong>API untuk aplikasi Digital Library. Dibangun dengan <a href="https://expressjs.com/">Express</a>, <a href="https://sequelize.org/">Sequelize</a> dan MySQL/MariaDB.</strong></p>
</div>

## Instalasi

1. Clone repository ini
```sh
git clone https://github.com/sglkc/digilib-api.git
cd digilib-api
```

2. Install package dengan npm
```sh
npm install
```

3. Copy `.env.example` ke `.env` dan ubah isinya bila perlu
4. Nyalakan MySQL
5. Buat database untuk aplikasi dan lakukan migrasi schema
```sh
npm run db:create
npm run db:migrate
```

6. Isi database dengan seed (opsional)
```sh
npm run db:seed
```

## Penggunaan

Jalankan dengan npm, lalu coba endpoint menggunakan aplikasi Postman dengan dokumentasi dibawah
```sh
npm start
```

## Dokumentasi

Untuk melihat seluruh endpoint dengan request beserta response dalam API ini, dapat dilihat di link berikut:

Jika link tidak dapat diakses, dalam folder `/docs` terdapat file Postman Collection:
- Versi 2.1: [digilib-api.postman_collection.2.1.json](/docs/digilib-api.postman_collection.2.1.json)
- Versi 2.0: [digilib-api.postman_collection.2.0.json](/docs/digilib-api.postman_collection.2.0.json)

## Entity Relationship Diagram

Gambar dibawah ini menjelaskan kolom-kolom yang ada pada setiap tabel dan juga relasinya antar tabel lainnya.

<img src="docs/diagram.png" alt="diagram">

## Lisensi

API ini bukan untuk kegunaan publik
