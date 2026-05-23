# Issue Tracker Application

A full-stack issue tracking application with CRUD operations, user authentication, and real-time filtering.

## Features

- User authentication (register/login with JWT)
- Create, Read, Update, Delete issues
- Filter issues by status and priority
- Search issues by title/description (debounced)
- Pagination for efficient data loading
- Status counts dashboard
- Responsive design with Tailwind CSS
- TypeScript on frontend for type safety

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- React Hot Toast for notifications

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Gamika99/Issue-Tracker-App.git
cd issue-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/issue-tracker
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```