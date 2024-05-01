# Dokumentasjon for Utlånssystem

## Table of contents 

1. [Install](#Install)
2. [Packages](#packages)
    1. [Frontend](#Frontend-packages)
    2. [Backend](#Backend-packages)
3. [Setup](#Setup)
4. [Database Modelling](#database)
5. [Developing](#developing)
    1. [Backend](#backend)
      1. [Endpoints](#api)
      2. [Rate Limiting](#rate-limiting)
      3. [Token](#token)
    2. [Frontend](#frontend)
       1. [Routing](#routing)
6. [Running on 2 computers with Ethernet](#running-on-2-computers-with-ethernet)
   1. [Prerequisites](#prerequisites)
   2. [Setup](#setup-1)
7. [Author](#author)
8. [License](#license)


## Install
### You need to install all packages used by the React app and the backend server.
#### Use this command in the **Terminal**. Run it in both the backend folder and the React folder.

```
npm install
```

## Packages

### Frontend-packages

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
| react-scripts           | [React Scripts](https://www.npmjs.com/package/react-scripts) | 5.0.1   |

### Backend-packages

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
| Express Rate Limit | [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit) | 6.7.0  |

## Setup

### Setting Up the Backend

To set up the backend, you need to ensure that certain steps are followed. This guide will help you understand how to configure the backend environment, connect to MongoDB Atlas.

### Configuration File (.env)
In the root directory of the backend project, you need a `.env` file that contains environment variables for configuration. The following are essential:

- **JWT_SECRET**: This is the secret key used for signing JSON Web Tokens (JWT). It should be a secure, random string.
- **URL**: This is the MongoDB connection string, typically provided by MongoDB Atlas. It usually starts with `mongodb+srv://` and includes your username, password, and cluster details.

Ensure your `.env` file is secure and not shared publicly.

### Connecting to MongoDB Atlas
To run the backend, you need a MongoDB database. You can set up a free database cluster on [MongoDB Atlas](https://www.mongodb.com/atlas). Once you have your cluster, obtain the connection string (also known as the URI) and add it to your `.env` file under `URL`.

```env
URL=your-mongodb-connection-string
JWT_SECRET=your-secure-jwt-secret
```

### Frontend Proxy Server
Make sure the target is the same as the backend

```js 
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
```

## Database

The database is modelled with JOI in the backend

### Collection Schemas

### User Schema

- **email**: (string, required) Must be a valid email address.
- **password**: (string, required) Must be at least 8 characters long.
- **class_id**: (string, required) Restricted to "2ITB", "2ITA", "IM".
- **role**: (string, required) Restricted to "Student" or "Teacher".
- **contact_info**:
  - **firstname**: (string, required) Between 3 and 20 characters. Only letters allowed.
  - **lastname**: (string, required) Between 3 and 20 characters. Only letters allowed.
  - **phone**: (string) Between 7 and 15 characters.
  - **adress**: (string) Maximum 50 characters.
  - **city**: (string) Maximum 30 characters.

### Equipment Schema

- **_id**: (string, required) Alphanumeric, between 5 and 20 characters.
- **Type**: (string, required) Maximum 20 characters.
- **Model**: (string, required) Maximum 20 characters.
- **Specs**: (array of strings) Each item can have up to 50 characters.
- **BorrowStatus**:
  - **currentStatus**: (string, required) Allowed values are "borrowed", "available", or "pending".
  - **studentsborrowing**: (array of objects) Contains objects with the following fields:
    - **email**: (string, required) Valid email.
    - **firstname**: (string, required) Between 3 and 20 characters.
    - **lastname**: (string, required) Between 3 and 20 characters.

### Borrow Request Schema

- **_id**: (string, required) Alphanumeric, between 5 and 20 characters.
- **studentsborrowing**: (array of objects) Contains objects with the following fields:
  - **email**: (string, required) Valid email.
  - **firstname**: (string, required) Between 3 and 20 characters.
  - **lastname**: (string, required) Between 3 and 20 characters.

## Developing

## Backend 

### API

If you want to further develop and make improvements to the Endspoints here's a table to describe each of them

| Endpoint               | HTTP Method | Description                                                                                                          |
|-----------------------|-------------|----------------------------------------------------------------------------------------------------------------------|
| /login                 | POST        | Logs in a user by checking their email and password. Returns a JWT token upon successful login.                      |
| /signup                | POST        | Signs up a new user with the provided email, password, role, class, and contact info. Returns a JWT token.            |
| /add-equipment         | PUT         | Adds new equipment. Requires teacher role. Returns a success message upon adding.                                     |
| /get-equipments        | GET         | Fetches all equipment data from the database. Requires a valid token for authentication.                             |
| /get-user-equipments   | GET         | Fetches the borrowed and pending equipment for the authenticated user. Requires a valid token.                       |
| /get-borrow-requests   | GET         | Fetches all borrow requests. Requires a valid token and teacher role.                                                 |
| /borrow-request        | POST        | Creates or updates a borrow request. Requires a valid token. Returns a success message upon creation or update.      |
| /borrow-deny           | PUT         | Denies a borrow request. Requires teacher role and the equipment ID in the request body. Returns a success message.  |
| /borrow-accept         | PUT         | Accepts a borrow request. Requires teacher role and the equipment ID in the request body. Returns a success message. |
| /remove-borrowed-equipment | PUT     | Removes borrowed equipment from the borrowing list. If it's the last request, it sets status to available.           |
| /remove-equipment       | PUT         | Deletes equipment by its ID. Requires teacher role. Returns a success message.                                       |
| /protected-route       | GET         | A simple endpoint to test token-based authentication. Returns a success message upon valid token authentication.     |
| /verify-teacher         | PUT         | Verifies a teacher. Requires admin role. Returns a success message upon verification.                                |
| /unverify-teacher       | PUT         | Unverifies a teacher. Requires admin role. Returns a success message upon unverification.                             |
| /get-teacher-requests   | GET         | Fetches all pending teacher verification requests. Requires admin role.                                               |

### Rate Limiting

To protect the API from excessive use or potential denial-of-service attacks, a rate limit has been implemented. The current rate limit is set to 10 requests per 5 seconds for each IP address.

If the rate limit is exceeded, the API will respond with an HTTP 429 status code and the message "Too many requests."

### Token

Each endpoint uses JSON Web Token as a middleware, the payload contains the whole user data.

```js 
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: err });
    }
    req.user = user;
    next();
  });
}
```

## Frontend

### Routing

Add equip and borrow is restriced only for the users with Teacher role which is used with CheckUserRole function from /utils

```js 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="addEquip" element={<AddEquipment />} />
          <Route path="equipments" element={<Equipment />} />
          <Route path='borrow' element={<BorrowRequest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## Running on 2 computers with Ethernet

This guide will help you set up a React application running on two separate computers connected via Ethernet. One computer will run the backend (server), and the other will run the frontend (React app). Both computers need to be connected to the same local network (LAN).


![ethernet](./2laptops.png)

### Prerequisites

1. **GitHub Repository**: Ensure that both computers have the required GitHub repository cloned.
2. **Node.js and npm**: Both computers should have Node.js and npm installed.
3. **MongoDB Connection**: The backend computer should be able to connect to MongoDB. Ensure the Wi-Fi is enabled for this connection.
4. **Environment File**: The backend computer must have a `.env` file with the necessary environment variables, such as JWT_SECRET and the MongoDB connection URL.

### Setup

#### Ethernet Connection

1. Connect the two computers with an Ethernet cable.
2. Change the Ethernet settings to use static IP addresses:

   - **Laptop 1 (Frontend)**
     - IP Address: `192.168.0.1`
     - Subnet Mask: `255.255.255.0`
   
   - **Laptop 2 (Backend)**
     - IP Address: `192.168.0.2`
     - Subnet Mask: `255.255.255.0`
3. try ping both computers to test if they both can communicate

#### Running the Backend

1. Open a terminal on Laptop 2 (backend).
2. Navigate to the backend folder of the project.
3. Start the server with the following command:
   ```bash
   node index.js
   ```

#### Running the Frontend
  1. Open a terminal on Laptop 1 (frontend).
  2. Navigate to the frontend folder of the project.
   3. Change the proxy server IP address to match the backend's IP. Edit the proxy configuration file to example below

```js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.0.2:8080',
      changeOrigin: true,
    })
  );
};
```

### Final Step
Once both the backend and frontend are running, your setup should be complete. 

# Author
| Person | Link |
| ----- | ----- |
| starkris51 | https://github.com/starkris51 |

# License
### MIT license