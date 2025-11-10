# Disaster Connect

A full-stack disaster management application connecting users, volunteers, and administrators.

## Features

- User registration and authentication
- Profile management
- Role-based access (user, volunteer, admin)
- Volunteer skills and availability tracking
- Location-based services

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing

### Frontend
- React Native
- Expo
- React Navigation
- AsyncStorage for token persistence
- Axios for API calls

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Adjust `PORT` if needed (default: 5000)

5. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `frontend/config.js`:
   - For Android emulator: `http://10.0.2.2:5000/api`
   - For iOS simulator: `http://localhost:5000/api`
   - For physical device: `http://YOUR_COMPUTER_IP:5000/api`
     - Find your IP: Windows (`ipconfig`), Mac/Linux (`ifconfig`)

4. Start the Expo development server:
```bash
npm start
```

5. Run on your preferred platform:
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web
   - Scan QR code with Expo Go app on your phone

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout user

### User Profile
- `GET /api/users/profile` - Get user profile (requires token)
- `PUT /api/users/profile` - Update user profile (requires token)

## User Model

- `name` (required) - User's full name
- `email` (required, unique) - User's email address
- `password` (required) - Hashed password
- `role` - One of: `user`, `volunteer`, `admin` (default: `user`)
- `skills` - Array of skills (for volunteers)
- `location` - Location object with address and coordinates
- `availability` - Boolean (for volunteers)
- `phone` - Phone number
- `isActive` - Account status
- `isVerified` - Email verification status

## Best Practices Implemented

1. **Security**
   - Password hashing with bcryptjs
   - JWT token-based authentication
   - Protected routes with middleware
   - Input validation

2. **Code Organization**
   - Separation of concerns (controllers, models, routes, middleware)
   - Error handling middleware
   - Environment variables for configuration

3. **Frontend Architecture**
   - Context API for state management
   - AsyncStorage for persistent authentication
   - Axios interceptors for automatic token injection
   - Navigation guards based on authentication state

4. **Error Handling**
   - Consistent error response format
   - User-friendly error messages
   - Proper HTTP status codes

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running and `MONGODB_URI` is correct
- **Port Already in Use**: Change `PORT` in `.env` file
- **JWT Errors**: Ensure `JWT_SECRET` is set in `.env`

### Frontend Issues
- **Cannot Connect to Backend**: 
  - Check API base URL in `config.js`
  - Ensure backend is running
  - For physical device, ensure both devices are on same network
  - Check firewall settings
- **Token Not Persisting**: Check AsyncStorage permissions

## Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

### Code Style
- Backend: Follow Express.js best practices
- Frontend: Follow React Native style guide

## License

MIT
