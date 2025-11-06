# Bloggram Frontend

A modern blogging platform frontend built with React, Vite, Chakra UI, and Material UI.

## Features

- **Home Feed**: View posts from users you follow
- **Explore**: Discover top posts
- **Search**: Search for users, hashtags, or posts
- **Create Post**: Upload media (images/videos) to Firebase Storage and create posts
- **User Panel**: View your profile and connections

## Setup

### 1. Install Dependencies

Dependencies are already installed via npm workspaces. If you need to reinstall:

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `Frontend` directory (copy from `.env.example`):

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:5000

# Firebase Configuration
# Get these from Firebase Console: Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Firebase Storage**
4. Go to Project Settings > General
5. Scroll down to "Your apps" and add a web app
6. Copy the configuration values to your `.env` file

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## Project Structure

```
Frontend/src/
├── components/
│   ├── navbar/
│   │   └── Navbar.jsx          # Top navigation bar
│   ├── left/
│   │   ├── UserPanel.jsx       # User profile panel
│   │   └── FriendsPanel.jsx    # Connections list
│   └── feed/
│       ├── PostCard.jsx        # Individual post component
│       └── Feed.jsx            # Feed container component
├── pages/
│   ├── Home.jsx                # Home feed page
│   ├── Explore.jsx             # Explore page
│   ├── Search.jsx              # Search page
│   └── CreatePost.jsx          # Create post page
├── services/
│   ├── apiClient.js            # Axios instance with auth
│   ├── postService.js          # Post API calls
│   ├── userService.js          # User API calls
│   ├── searchService.js        # Search API calls
│   └── firebase.js             # Firebase Storage helpers
├── providers/
│   └── UiProvider.jsx          # Chakra + MUI providers
└── routes/
    └── AppRouter.jsx           # React Router configuration
```

## Backend API Endpoints

The frontend expects the following backend endpoints:

- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create a new post
- `GET /api/posts/search` - Search posts
- `GET /api/users/me` - Get current user
- `GET /api/users/me/connections` - Get user connections

## Media Upload Flow

1. User selects media files in CreatePost page
2. Files are uploaded to Firebase Storage via `uploadMedia()` function
3. Download URLs are returned
4. Post is created via backend API with media URLs
5. Backend stores URLs in MongoDB

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool
- **Chakra UI** - Component library (layout, theme)
- **Material UI** - Component library (icons, complex widgets)
- **React Router** - Routing
- **Axios** - HTTP client
- **Firebase** - Storage for media files
