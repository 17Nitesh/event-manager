# Event Management Platform

## Overview
This is a full-stack event management platform that allows users to create, join, and manage events in real-time. The application features real-time attendee tracking using **Socket.IO**, secure authentication with **JWT**, cloud-based image storage via **Cloudinary**, and a modern UI built with **React** and **Tailwind CSS**.

## Features
- **User Authentication**: Secure login & signup using JWT.
- **Event Creation & Management**: Users can create, edit, and delete events.
- **Real-time Attendee Count**: Live updates when users join or leave events.
- **Cloudinary Integration**: Upload images for event banners.
- **Socket.IO Integration**: Real-time event interactions.
- **Responsive UI**: Built using React and Tailwind CSS.

## Tech Stack
### Frontend
- React
- Tailwind CSS
- Axios
- React Router
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- JWT Authentication
- Cloudinary for image hosting
- Socket.IO for real-time updates

## Installation
### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+ recommended)
- **MongoDB** (local or cloud via MongoDB Atlas)

### Clone the Repository
```sh
git clone https://github.com/yourusername/event-management-platform.git
cd event-management-platform
```

### Backend Setup
```sh
cd server
npm install
```

#### Create a `.env` file in the `server` directory with the following:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Run the Server
```sh
npm start
```

### Frontend Setup
```sh
cd ../client
yarn install
```

#### Run the Frontend
```sh
yarn dev
```

## API Endpoints
### Authentication
- **POST** `/api/auth/signup` - Register a new user
- **POST** `/api/auth/login` - Login user & receive token

### Events
- **GET** `/api/events` - Get all events
- **POST** `/api/events` - Create a new event (Auth required)
- **GET** `/api/events/:id` - Get a specific event
- **PUT** `/api/events/:id` - Update an event (Auth required)
- **DELETE** `/api/events/:id` - Delete an event (Auth required)
- **POST** `/api/events/:id/join` - Join an event
- **POST** `/api/events/:id/leave` - Leave an event

## WebSockets (Real-time Features)
- `join_event` - User joins an event
- `leave_event` - User leaves an event
- `update_attendee_count` - Updates frontend with the latest attendee count

## Contributing
Feel free to contribute to this project by opening an issue or submitting a pull request.


