Event Management Application
A real-time event management platform that allows users to create, join, and manage events with live attendance tracking.
Features

User Authentication

Secure login and registration
JWT-based authentication
Protected routes


Event Management

Create new events with detailed information
Upload event images
Edit and delete events (owner only)
View event details
Real-time attendance tracking


Real-time Features

Live attendee count updates
Socket.io integration for real-time communication
Instant updates when users join or leave events



Technology Stack
Frontend

React.js
React Router for navigation
Socket.io-client for real-time updates
Tailwind CSS for styling
Lucide React for icons
Axios for API requests

Backend

Node.js
Express.js
MongoDB with Mongoose
Socket.io for real-time communication
Cloudinary for image storage
JWT for authentication

Prerequisites
Before running this application, make sure you have:

Node.js (v14 or higher)
MongoDB
Cloudinary account
npm or yarn package manager

Installation

Clone the repository:

bashCopygit clone [your-repo-link]
cd [your-project-name]

Install dependencies:

For backend:
bashCopycd backend
npm install
For frontend:
bashCopycd frontend
npm install

Set up environment variables:

Create a .env file in the backend directory with:
envCopyPORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Create a .env file in the frontend directory with:
envCopyREACT_APP_API_URL=http://localhost:5000
Running the Application

Start the backend server:

bashCopycd backend
npm run dev

Start the frontend development server:

bashCopycd frontend
npm start
The application will be available at http://localhost:3000
API Endpoints
Authentication

POST /api/auth/register - Register a new user
POST /api/auth/login - Login user

Events

GET /api/events - Get all events
GET /api/events/:id - Get specific event
POST /api/events - Create new event
PUT /api/events/:id - Update event
DELETE /api/events/:id - Delete event
POST /api/events/:id/join - Join event
POST /api/events/:id/leave - Leave event

Socket Events
Client Events

join_event - Emitted when a user joins an event
leave_event - Emitted when a user leaves an event

Server Events

update_attendee_count - Broadcast updated attendee count

Project Structure
Copy├── backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   └── App.js
│   └── package.json
│
└── README.md
Contributing

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
