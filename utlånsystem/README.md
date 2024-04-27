# Dokumentasjon for Utlånssystem

## Innholdsfortegnelse 

1. [Installasjon](#Installasjon)
2. [Packages](#packages)
    1. [Frontend](#Frontend-pakker)
    2. [Backend](#Backend-pakker)
3. [Developing](#developing)
   1. [Server](#server-backend)

   2. [React App](#react-app-frontend)

4. [Author](#author)
5. [License](#license)


## Installasjon
### Du må installere alle pakkene som React-appen og serveren bruker.
#### Bruk denne kommandoen i **Terminalen**. Kjør den både i backend-mappen og i React-mappen.

```
npm install
```

### Bygg React-prosjektet
```
npm run build
```

## Packages

### Frontend-pakker

| Pakke                  | Lenke                                             | Versjon  |
| ----------------------|---------------------------------------------------|----------|
| ReactJS                | [ReactJS](https://react.dev)                      | 18.2.0   |
| React Router DOM       | [React Router](https://github.com/remix-run/react-router) | 6.22.0   |
| @mui/material          | [Material UI](https://mui.com/)                   | 5.15.15  |
| @emotion/react         | [Emotion](https://emotion.sh/docs/introduction)   | 11.11.4  |
| @emotion/styled        | [Emotion Styled](https://emotion.sh/docs/styled)  | 11.11.5  |
| Axios                  | [Axios](https://axios-http.com/)                  | 1.4.0    |
| http-proxy-middleware  | [Proxy Middleware](https://www.npmjs.com/package/http-proxy-middleware) | 3.0.0 |
| jwt-decode             | [JWT Decode](https://github.com/auth0/jwt-decode) | 4.0.0    |
| @fontsource/roboto     | [FontSource Roboto](https://fontsource.org/fonts/roboto) | 5.0.13  |
| @testing-library/jest-dom | [Jest DOM](https://testing-library.com/docs/jest-dom/intro) | 5.17.0  |
| @testing-library/react | [Testing Library React](https://testing-library.com/docs/react-testing-library/intro) | 13.4.0  |
| @testing-library/user-event | [Testing User Event](https://testing-library.com/docs/user-event/intro) | 13.5.0  |
| react-scripts           | [React Scripts](https://www.npmjs.com/package/react-scripts) | 5.0.1   |
| web-vitals              | [Web Vitals](https://web.dev/vitals/)            | 2.1.4    |

### Backend-pakker

| Pakke    | Lenke                                      | Versjon  |
| --------|-------------------------------------------|----------|
| Express  | [Express](https://expressjs.com/)           | 4.18.3   |
| Bcrypt    | [Bcrypt](https://www.npmjs.com/package/bcrypt) | 5.1.1  |
| Cors      | [Cors](https://www.npmjs.com/package/cors)   | 2.8.5   |
| Dotenv    | [Dotenv](https://www.npmjs.com/package/dotenv) | 16.4.5 |
| Http      | [HTTP](https://www.npmjs.com/package/http)  | 0.0.1-security |
| Joi       | [Joi](https://joi.dev/)                     | 17.12.3 |
| JsonWebToken | [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | 9.0.2  |
| MongoDB   | [MongoDB](https://www.mongodb.com/)          | 6.5     |

## Database Modellering

Databasen er modellert fra backenden

### Bruker Schema (UserSchema)

- **email**: (string, kreves) Må være en gyldig e-postadresse.
- **password**: (string, kreves) Må være minst 8 tegn langt.
- **class_id**: (string, kreves) Begrenset til "2ITB", "2ITA", "IM".
- **role**: (string, kreves) Begrenset til "Student" eller "Teacher".
- **contact_info**:
  - **firstname**: (string, kreves) Mellom 3 og 20 tegn. Bare bokstaver tillatt.
  - **lastname**: (string, kreves) Mellom 3 og 20 tegn. Bare bokstaver tillatt.
  - **phone**: (string) Mellom 7 og 15 tegn.
  - **adress**: (string) Maks 50 tegn.
  - **city**: (string) Maks 30 tegn.

### Utstyr Schema (EquipmentSchema)

- **_id**: (string, kreves) Alfanumerisk, mellom 5 og 20 tegn.
- **Type**: (string, kreves) Maks 20 tegn.
- **Model**: (string, kreves) Maks 20 tegn.
- **Specs**: (array av string) Hver element kan ha opptil 50 tegn.
- **BorrowStatus**:
  - **currentStatus**: (string, kreves) Tillatte verdier er "borrowed", "available", eller "pending".
  - **studentsborrowing**: (array av objekter) Inneholder objekter med følgende:
    - **email**: (string, kreves) Gyldig e-post.
    - **firstname**: (string, kreves) Mellom 3 og 20 tegn.
    - **lastname**: (string, kreves) Mellom 3 og 20 tegn.

### Utlånsforespørsel Schema (BorrowRequestSchema)

- **_id**: (string, kreves) Alfanumerisk, mellom 5 og 20 tegn.
- **studentsborrowing**: (array av objekter) Inneholder objekter med følgende:
  - **email**: (string, kreves) Gyldig e-post.
  - **firstname**: (string, kreves) Mellom 3 og 20 tegn.
  - **lastname**: (string, kreves) Mellom 3 og 20 tegn.

# Author
| Person | Link |
| ----- | ----- |
| starkris51 | https://github.com/starkris51 |

# License
### MIT license