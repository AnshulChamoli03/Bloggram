# Bloggram

A full-stack social media platform built from scratch, allowing users to create posts, connect with others, explore content, and interact through likes and comments. This is a personal project demonstrating modern web development practices with React, Node.js, and MongoDB.

## 🚀 Features

### User Management
- **User Registration & Authentication**: Secure user registration and login with JWT tokens
- **Profile Management**: Customizable user profiles with profile pictures, bio, and user information
- **User Connections**: Add and remove connections (friends) with other users
- **User Suggestions**: Discover new users to connect with based on your network

### Content Management
- **Create Posts**: Share text content with optional media URLs and hashtags
- **Like/Unlike Posts**: Interact with posts through likes and unlikes
- **Explore Feed**: Discover posts from all users in the platform
- **Home Feed**: View posts from your connections
- **Search**: Search for users by username or email

### User Interface
- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Modern UI**: Built with Chakra UI and Material-UI for a polished user experience
- **Real-time Updates**: Automatic refresh of connections and suggestions
- **Protected Routes**: Secure navigation with authentication checks

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Client-side routing
- **Chakra UI** - Component library for styling
- **Material-UI** - Additional UI components
- **Axios** - HTTP client for API requests
- **Firebase** - Authentication and storage (optional)
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Bloggram/
├── Backend/
│   ├── config/
│   │   └── db.js                 # Database connection configuration
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT authentication middleware
│   ├── models/
│   │   ├── user.model.js         # User schema and model
│   │   └── post.model.js         # Post schema and model
│   ├── routes/
│   │   ├── user.routes.js        # User-related API endpoints
│   │   └── post.routes.js       # Post-related API endpoints
│   └── server.js                 # Express server setup
│
├── Frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Reusable components
│   │   │   ├── feed/             # Post feed components
│   │   │   ├── left/             # Sidebar components
│   │   │   └── navbar/           # Navigation components
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/                # Page components
│   │   ├── providers/             # UI providers
│   │   ├── routes/
│   │   │   └── AppRouter.jsx     # Application routing
│   │   └── services/             # API service functions
│   ├── package.json
│   └── vite.config.js
│
└── package.json                  # Root package.json for workspace
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Bloggram
```

### Step 2: Install Dependencies
```bash
# Install root dependencies (includes Backend dependencies)
npm install

# Install Frontend dependencies
cd Frontend
npm install
cd ..
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/bloggram
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bloggram

# JWT Secret Key (use a strong random string in production)
JWT_SECRET=your-secret-key-change-in-production

# Node Environment
NODE_ENV=development

# Server Port (optional, defaults to 5000)
PORT=5000
```

### Step 4: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# Or start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Step 5: Run the Application

#### Development Mode (Recommended)
Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

#### Run Separately

**Backend only:**
```bash
cd Backend
nodemon server.js
```

**Frontend only:**
```bash
cd Frontend
npm run dev
```

### Step 6: Build for Production
```bash
# Build frontend
cd Frontend
npm run build

# The built files will be in Frontend/dist/
```

## 📖 Usage Guide

### Getting Started

1. **Register a New Account**
   - Navigate to `/login`
   - Click on "Register" or "Sign Up"
   - Fill in your username, email, and password
   - Optionally add a profile picture URL and bio

2. **Login**
   - Use your registered email and password to login
   - You'll be redirected to the home page upon successful login

3. **Create Your First Post**
   - Click on "Create Post" in the navigation bar
   - Enter your post content
   - Optionally add media URLs (images/videos)
   - Add hashtags (format: `#hashtag`)
   - Click "Post" to publish

4. **Connect with Users**
   - View user suggestions in the left sidebar
   - Click the "+" button next to a user to add them as a connection
   - View your connections in the "Connections" panel
   - Remove connections by clicking the "-" button

5. **Explore Content**
   - Use the "Explore" page to see posts from all users
   - Use the "Home" page to see posts from your connections
   - Like posts by clicking the like button
   - Unlike posts if you change your mind

6. **Search for Users**
   - Navigate to the "Search" page
   - Enter a username or email to find users
   - View user profiles and connect with them

7. **Edit Your Profile**
   - Click on your profile in the left sidebar
   - Navigate to "Edit Profile"
   - Update your username, bio, profile picture, or mobile number
   - Save your changes

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/users/register
Body: {
  userName: string (required),
  email: string (required),
  password: string (required, min 6 chars),
  profilePicture: string (optional, URL),
  bio: string (optional),
  mobile: string (optional, 10 digits)
}
```

#### Login
```
POST /api/users/login
Body: {
  email: string (required),
  password: string (required)
}
Response: {
  token: string,
  user: UserObject
}
```

### User Endpoints

#### Get Current User Profile
```
GET /api/users/me
Headers: Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/users/me
Headers: Authorization: Bearer <token>
Body: {
  userName: string (optional),
  bio: string (optional),
  profilePicture: string (optional, URL),
  mobile: string (optional)
}
```

#### Get All Users (Suggestions)
```
GET /api/users/
```

#### Get User Connections
```
GET /api/users/me/connections
Headers: Authorization: Bearer <token>
```

#### Add/Remove Connection
```
POST /api/users/me/connections/:userId
Headers: Authorization: Bearer <token>
Response: {
  connected: boolean,
  message: string
}
```

#### Search Users
```
GET /api/users/search?userName=string&email=string
```

### Post Endpoints

#### Create Post
```
POST /api/posts
Headers: Authorization: Bearer <token>
Body: {
  content: {
    text: string (required),
    media: [string] (optional, array of URLs)
  },
  hashtags: [string] (optional, format: #hashtag)
}
```

#### Get All Posts (Explore)
```
GET /api/posts/explore
Headers: Authorization: Bearer <token>
```

#### Get Feed (Connections' Posts)
```
GET /api/posts/feed
Headers: Authorization: Bearer <token>
```

#### Like/Unlike Post
```
POST /api/posts/:postId/like
Headers: Authorization: Bearer <token>
```

#### Unlike Post
```
POST /api/posts/:postId/unlike
Headers: Authorization: Bearer <token>
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After successful login, the token is stored in localStorage and included in API requests via the `Authorization` header.

**Token Format:**
```
Authorization: Bearer <jwt-token>
```

Tokens expire after 7 days. Users need to login again after expiration.

## 🗄️ Database Schema

### User Schema
```javascript
{
  userName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  mobile: String (optional, 10 digits),
  profilePicture: String (optional, URL),
  bio: String (optional),
  connections: [ObjectId] (references to User),
  posts: [ObjectId] (references to Post)
}
```

### Post Schema
```javascript
{
  user: ObjectId (required, references User),
  userName: String (required),
  content: {
    text: String (required),
    media: [String] (optional, URLs)
  },
  hashtags: [String] (optional, format: #hashtag),
  likes: [ObjectId] (references to User),
  unlikes: [ObjectId] (references to User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Components

### Main Components
- **Navbar**: Top navigation bar with links to main pages
- **UserPanel**: Left sidebar showing current user profile
- **FriendsPanel**: Shows user connections and suggestions
- **Feed**: Displays posts in a scrollable feed
- **PostCard**: Individual post component with like/unlike functionality

### Pages
- **Home**: Feed of posts from user's connections
- **Explore**: Feed of posts from all users
- **Search**: Search page for finding users
- **CreatePost**: Form for creating new posts
- **EditProfile**: Form for editing user profile
- **Auth**: Login and registration page

## 🔒 Security Features

- Password hashing using bcryptjs
- JWT token-based authentication
- Protected API routes with authentication middleware
- Input validation on both client and server
- CORS configuration for secure cross-origin requests
- Password requirements (minimum 6 characters)

## 🚧 Future Enhancements

Potential features to add:
- Comments on posts
- Real-time notifications
- Direct messaging
- Post editing and deletion
- Image upload (currently requires URLs)
- User following/followers system
- Post sharing
- Activity feed
- Dark mode

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity if using MongoDB Atlas

**Port Already in Use**
- Change PORT in .env file
- Or kill the process using the port

**CORS Errors**
- Verify CORS origin in Backend/server.js matches frontend URL
- Default is set to `http://localhost:5173`

**Authentication Issues**
- Clear localStorage and login again
- Check JWT_SECRET in .env file
- Verify token is being sent in request headers

## 📝 License

This is a personal project. Feel free to use it as a reference or starting point for your own projects.

## 👤 Author

Personal project - Built from scratch as a learning exercise in full-stack development.

---

**Note**: This is a personal project built for educational purposes. For production use, consider adding:
- Input sanitization
- Rate limiting
- Error logging
- Database indexing
- API documentation (Swagger/OpenAPI)
- Unit and integration tests
- CI/CD pipeline
