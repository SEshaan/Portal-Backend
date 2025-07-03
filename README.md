to start contributing, clone the repo and run ```npm install``` to install dependencies
then make your changes in a branch to avoid conflicts 

hmu for the env variables 
(ts will not work without the env variables)

big thanks to chatgpt for the documentation
thanks to all the stackoverflow gods for such detailed answers
and thanks for explaining the difference between PATCH and POST

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

> All team routes require authentication (`protect` middleware).

### 🏗️ Create Team

`POST /api/team/create`

Creates a new team. The user who creates the team automatically becomes the leader.

**Body:**

```json
{
  "teamName": "The A-Team"
}
```

**Response:**

```json
{
  "message": "Team created successfully",
  "teamId": "60d5f2b4a6d2f1a2b8c0d3e4"
}
```

---

### ➕ Join Team

`POST /api/team/join`

Joins an existing team.

**Body:**

```json
{
  "teamName": "The A-Team"
}
```

**Response:**

```json
{
  "message": "Joined team successfully"
}
```

---

### 🚪 Leave Team

`POST /api/team/leave`

Leaves the current team. The user is identified by the JWT token.

**Response:**

```json
{
  "message": "Successfully left the team"
}
```

---

### ❌ Kick Member *(Leader Only)*

`POST /api/team/kick`

Kicks a member from the team. This action can only be performed by the team leader.

**Body:**

```json
{
  "memberRegId": "24BCE0001"
}
```

**Response:**

```json
{
  "message": "Member kicked successfully"
}
```

---

### 🔁 Transfer Leadership *(Leader Only)*

`POST /api/team/transfer-leadership`

Transfers leadership to another member of the team.

**Body:**

```json
{
  "newLeaderRegId": "24BCE0001"
}
```

**Response:**

```json
{
  "message": "Leadership transferred successfully"
}
```

---

### 🗑️ Delete Team *(Leader Only)*

`POST /api/team/delete`

Deletes the entire team. This action can only be performed by the team leader.

**Response:**

```json
{
  "message": "Team deleted successfully"
}
```

---

### ℹ️ Get Team Info by Registration ID

`GET /api/team/info/:regId`

Retrieves team information for a specific user by their registration ID.

**Parameters:**

-   `regId`: The registration ID of the user.

**Response:**

```json
{
  "teamName": "The A-Team",
  "teamId": "60d5f2b4a6d2f1a2b8c0d3e4",
  "members": [
    {
      "_id": "60d5f2b4a6d2f1a2b8c0d3e5",
      "name": "John Doe",
      "regId": "24BCE0000",
      "isLeader": true
    }
  ]
}
```

---

### 🙋 Get My Team Info

`GET /api/team/me`

Retrieves the team information for the currently authenticated user.

**Response:**

```json
{
  "teamName": "The A-Team",
  "teamId": "60d5f2b4a6d2f1a2b8c0d3e4",
  "leaderId": "60d5f2b4a6d2f1a2b8c0d3e5",
  "members": [
    {
      "_id": "60d5f2b4a6d2f1a2b8c0d3e5",
      "name": "John Doe",
      "regId": "24BCE0000",
      "isLeader": true
    }
  ],
  "submissionLink": "https://github.com/example/project"
}
```

---

### 🔗 Update Submission Link *(Leader Only)*

`PATCH /api/team/:id/submission`

Updates the submission link for the team. This action can only be performed by the team leader.

**Parameters:**

-   `id`: The ID of the team.

**Body:**

```json
{
  "link": "https://github.com/example/updated-project"
}
```

**Response:**

```json
{
  "message": "Submission link updated"
}
```

---

## 🔧 Admin Routes

> All admin routes require both `protect` **and** `requireAdmin` middleware

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
| `protect`   | Verifies JWT token & sets `req.user` |
| `requireLeader` | Checks if `req.user.isLeader`        |
| `requireAdmin`  | Checks if `req.user.isAdmin`         |

---


