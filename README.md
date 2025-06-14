to start contributing, clone the repo and run ```npm install``` to install dependencies
then make your changes in a branch to avoid conflicts 

hmu for the env variables 
(ts will not work without the env variables)

---

# 🚀 Hackathon Portal Backend API Documentation

Built with **Node.js + Express + MongoDB**
Handles user authentication, team formation, and admin management.

---

## 🧾 Base URL

```
localhost:PORT/api
```
##### as of now only due to its sensitive nature

---

## 📦 Authentication Routes

### ✅ Register

`POST /auth/register`
Registers a new user.

**Body:**

```json
{
  "name": "John Doe",
  "regId": "24BCE0000",
  "email": "john@example.com",
  "password": "securepassword"
}
```

---

### 🔐 Login

`POST /auth/login`
Logs in a user and sets an `HttpOnly` JWT cookie.

**Body:**

```json
{
  "regId": "24BEC0431",
  "password": "securepassword"
}
```

---

### 🚪 Logout

`POST /auth/logout`
Clears the JWT cookie.

---

## 👥 Team Routes

> All team routes require authentication (`requireAuth` middleware)

### 🏗️ Create Team

`POST /team/create`
**Body:**

```json
{
  "teamName": "ByteHunters",
  "regId": "24BCE0000"
}
```

---

### ➕ Join Team

`POST /team/join`
**Body:**

```json
{
  "teamName": "ByteHunters",
  "regId": "24BEC0002"
}
```

---

### 🚪 Leave Team

`POST /team/leave`
**Body:**

```json
{
  "regId": "24BEC0002"
}
```

---

### ❌ Kick Member *(Leader Only)*

`POST /team/kick`
**Body:**

```json
{
  "leaderRegId": "24BCE0000",
  "memberRegId": "24BCE0002"
}
```

---

### 🔁 Transfer Leadership *(Leader Only)*

`POST /team/transfer-leadership`
**Body:**

```json
{
  "currentLeaderRegId": "24BCE0000",
  "newLeaderRegId": "24BCE0002"
}
```

---

### 🗑️ Delete Team *(Leader Only)*

`POST /team/delete`
**Body:**

```json
{
  "leaderRegId": "24BCE0000"
}
```

---

### 🔍 Get Team Info

`GET /team/info/:regId`
Returns info for the team the given user belongs to.

---

## 🔧 Admin Routes

> All admin routes require both `requireAuth` **and** `requireAdmin` middleware

### 📋 List All Users

`GET /admin/users`

---

### 🚫 Delete a User

`DELETE /admin/users/:regId`

---

### ⭐ Toggle Admin Access

`PATCH /admin/users/:regId/toggle-admin`

---

### 🧾 List All Teams

`GET /admin/teams`

---

### ❌ Delete a Team

`DELETE /admin/teams/:teamId`

---

## 🧠 Tech Stack

* **MongoDB Atlas** – Cloud database
* **Express.js** – Backend framework
* **bcryptjs** – Password hashing
* **jsonwebtoken** – JWT auth with cookies
* **cookie-parser** – Parses `req.cookies`
* **Mongoose** – ODM for MongoDB

---

## 🛡️ Middleware Summary

| Middleware      | Purpose                              |
| --------------- | ------------------------------------ |
| `requireAuth`   | Verifies JWT token & sets `req.user` |
| `requireLeader` | Checks if `req.user.isLeader`        |
| `requireAdmin`  | Checks if `req.user.isAdmin`         |

---

