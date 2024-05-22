# Users

## User Table

```
| no | Nama Kolom    | Tipe Data                   | panjang |
|----|---------------|-----------------------------|---------|
| 1  | id            | int                         |         |
| 2  | email         | character varying / varchar | 255     |
| 3  | password      | character varying / varchar | 255     |
| 4  | nama          | character varying / varchar | 255     |
| 5  | npp           | int                         |         |
| 5  | npp_supervisor| int                         |         |

```

## **Post /Register**

Register users in the system.

- **Method**
  - `post`
- **Url**
  - `/auth/register`
- **Request Body**
- `nama` as `string`
- `email` as `string`, must be `Unique`
- `password` as `string`, must be at least `8 characters`
- `npp` as `number`
- `npp_supervisor` as `number`, optional
- **Headers**  
  Content-Type: application/json
- **Success Response:**
  - **Code:** 200

```
{
  "message": "User Created"
}
```

## **Post /Login**

Login for users in the system.

- **Method**
  - `post`
- **Url**
  - `/auth/login`
- **Request Body**
  - `email` as `string`, must be `Unique`
  - `password` as `string`, must be at least `8 characters`
- **Headers**  
  Content-Type: application/json
- **Success Response:**
  - **Code:** 200

```
{
  "data": {
    "nama": "bayu",
    "email": "bayu@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNjM4MDY0OSwiZXhwIjoxNzE2NDIzODQ5fQ.4e2S_0BsBk08tlR4KgWEe38yH4oblO8zHZ2i1Af53tU"
}
```

# Presence

- Presence object

## Table Presence (Varchar)

```
| no  | Nama Kolom | Tipe Data                   | panjang |
| --- | ---------- | --------------------------- | ------- |
| 1   | id         | int                         |         |
| 2   | id_users   | int                         |         |
| 3   | is_approve | boolean                     |         |
| 4   | waktu      | character varying / varchar | 25      |
| 5   | type       | ENUM("TYPE"["IN","OUT"])    |         |
```

## Table Presence (DateType)

```
| no  | Nama Kolom | Tipe Data                  | panjang |
| --- | ---------- | -------------------------- | ------- |
| 1   | id         | int                        |         |
| 2   | id_users   | int                        |         |
| 3   | is_approve | boolean                    |         |
| 4   | waktu      | timestamp without timezone |         |
| 5   | type       | ENUM("TYPE"["IN","OUT"])   |         |

```

## **Post /presence/create**

Insert New Presence.

- **Method**
  - `post`
- **Url**
  - `/presence/create`
- **Request Body**
  - `waktu` as `string datetime`, example: `"2022-02-18 07:00:00"`
  - `type` as `string Enum`, valued `"IN"` or `"OUT"`
- **Headers**

  - `Authorization`: `Bearer <token>`
  - `Content-Type: application/json`

- **Success Response:**
  - **Code:** 200

```
{
  "message": "Insert Epresence Success"
}
```

## **Post /presence/update/:id**

Insert New Presence.

- **Method**
  - `post`
- **Url**
  - `/presence/update/{:id}`
- **Request Body**
  - `is_approve` as `boolean`, `true` or `false`
- **Headers**
  - `Authorization`: `Bearer <token>`
  - `Content-Type: application/json`

- **Success Response:**
  - **Code:** 200

```
{
  "message": "Update Epresence Success"
}
```
## **Get /presence/getData**

Insert New Presence.

- **Method**
  - `getData`
- **Url**
  - `/presence/getData`
- **Headers**
  - `Authorization`: `Bearer <token>`
  - `Content-Type: application/json`

- **Success Response:**
  - **Code:** 200

```
{
  "message": "Success get data",
  "data": [
    {
      "id_user": 1,
      "nama_user": "bayu",
      "tanggal": "2022-02-15",
      "waktu_masuk": "08:00:00",
      "waktu_pulang": "07:00:00",
      "status_masuk": "REJECT",
      "status_pulang": "APPROVE"
    },
    {
      "id_user": 1,
      "nama_user": "bayu",
      "tanggal": "2022-02-16",
      "waktu_masuk": "08:00:00",
      "waktu_pulang": null,
      "status_masuk": "REJECT",
      "status_pulang": null
    },
  ]
}
```