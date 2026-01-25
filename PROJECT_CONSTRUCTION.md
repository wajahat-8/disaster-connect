# Disaster Connect - Project Construction Documentation

##  Development Environment

### 1.1. Programming Languages

#### 1.1.1. JavaScript (JS)
JavaScript is the primary programming language used throughout the project. It powers both the frontend mobile application (React Native) and the backend API server (Node.js/Express).

#### 1.1.2. JSX (JavaScript XML)
JSX is used extensively in the React Native frontend to describe the UI structure. It allows writing HTML-like syntax directly in JavaScript files, making component creation intuitive and readable.

### 1.2. Frameworks / Libraries

#### 1.2.1. React Native
A JavaScript framework for building native mobile applications. React Native allows us to write cross-platform mobile apps (iOS and Android) using a single JavaScript codebase while rendering truly native components.

#### 1.2.2. Expo
A framework and platform built around React Native that simplifies development with pre-built native modules, easy builds, and over-the-air updates. We use Expo SDK 54 for core functionality including:
- `expo-location`: GPS and location services
- `expo-image-picker`: Camera and gallery access
- `expo-notifications`: Push notification handling
- `expo-device`: Device information

#### 1.2.3. React Navigation
The standard navigation library for React Native. We use:
- `@react-navigation/native`: Core navigation container
- `@react-navigation/native-stack`: Stack-based screen navigation
- `@react-navigation/bottom-tabs`: Bottom tab navigation for main app sections

#### 1.2.4. React Native Paper
A Material Design component library that provides pre-styled, accessible UI components (buttons, cards, inputs, etc.) and a customizable theming system.

#### 1.2.5. Express.js
A minimal, flexible Node.js web application framework used to build the RESTful API backend. Express handles routing, middleware, and HTTP request/response management.

#### 1.2.6. Mongoose
An Object Document Mapper (ODM) for MongoDB. Mongoose provides schema validation, middleware hooks, and an intuitive API for database operations.

#### 1.2.7. Axios
A promise-based HTTP client used in the frontend to make API calls to the backend server. It handles request/response interception, error handling, and automatic JSON transformation.

#### 1.2.8. Expo Server SDK
Used on the backend to send push notifications to mobile devices through Expo's push notification service.

### 1.3. Database

#### 1.3.1. MongoDB
A NoSQL document database used for storing all application data. MongoDB's flexible schema design is ideal for storing:
- User profiles with location data
- Disaster reports with geospatial coordinates
- Shelter information with facilities arrays
- Lost & found items with images
- Donation records

MongoDB's geospatial indexing (`2dsphere`) enables efficient location-based queries for finding nearby disasters and shelters.

### 1.4. IDE (Integrated Development Environment)

#### 1.4.1. Visual Studio Code (VS Code)
The primary IDE used for development, featuring:
- Syntax highlighting for JS/JSX
- IntelliSense for code completion
- Integrated terminal for running dev servers
- Git integration for version control
- Extensions for React Native, ESLint, and Prettier

### 1.5. Operating System

#### 1.5.1. Windows 10/11
Development takes place on Windows. The tech stack (Node.js, React Native, MongoDB) is cross-platform, allowing deployment and development on macOS or Linux as well.

---

## 2. Build Process

### 2.1. Frontend Build (Expo/Metro)

#### 2.1.1. JavaScript/JSX Transpilation
Metro bundler (Expo's default) transpiles modern ES6+ JavaScript and JSX into compatible JavaScript that runs on mobile devices. Babel (`babel-preset-expo`) handles the transformation of:
- Arrow functions
- Import/export statements
- JSX component syntax
- Async/await patterns

#### 2.1.2. Development Build
```bash
npm start          # Start Expo development server
expo run:android   # Run on Android device/emulator
expo run:ios       # Run on iOS simulator (macOS only)
```

#### 2.1.3. Production Build (EAS)
Expo Application Services (EAS) handles production builds:
```bash
eas build --platform android --profile production
```

### 2.2. Backend Build

#### 2.2.1. Node.js Runtime
The backend runs directly on Node.js without compilation. Environment configuration is loaded via `dotenv`.

```bash
npm start     # Production: node server.js
npm run dev   # Development: nodemon server.js (auto-restart)
```

---

## 3. Coding Standards

### 3.1. Naming Conventions

| Context | JavaScript/React Native | Node.js/Express |
|---------|------------------------|-----------------|
| Components/Classes | PascalCase (e.g., `HomeScreen`, `AppButton`) | PascalCase (e.g., `User`, `DisasterReport`) |
| Functions/Methods | camelCase (e.g., `handleSubmit`, `fetchDisasters`) | camelCase (e.g., `createUser`, `getAllShelters`) |
| Variables/Props | camelCase (e.g., `isLoading`, `userData`) | camelCase (e.g., `req`, `authToken`) |
| Constants | UPPER_SNAKE_CASE (e.g., `API_URL`) | UPPER_SNAKE_CASE (e.g., `JWT_SECRET`) |
| Files (Screens) | PascalCase (e.g., `HomeScreen.js`) | camelCase (e.g., `authController.js`) |
| Database Fields | camelCase (e.g., `createdBy`, `fcmToken`) | camelCase (e.g., `isVerified`, `profileImage`) |

### 3.2. Commenting

Comments explain functions, complex logic, and API endpoints.

**Backend Example:**
```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});
```

**Frontend Example:**
```javascript
// Navigate with shelter data passed as params
const handleShelterPress = (shelter) => {
  navigation.navigate('ShelterDetail', { shelter });
};
```

### 3.3. Error Handling

#### 3.3.1. Frontend (React Native)
- **API Errors**: Axios interceptors catch network errors and display user-friendly alerts
- **Form Validation**: Inline validation with error state management
- **Loading States**: `AppLoader` component displays during async operations
- **Try/Catch Blocks**: All async operations wrapped in error handling

#### 3.3.2. Backend (Express/Node.js)
- **Async Handler Middleware**: Wraps async functions to catch unhandled rejections
- **Global Error Handler**: Centralized error formatting and logging
- **Validation**: Mongoose schema validation with custom error messages
- **Authentication Guards**: JWT middleware protects secured routes

**Example Error Handler:**
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

### 3.4. Code Formatting Rules

#### 3.4.1. Indentation
- **JavaScript/JSX**: 2 spaces per level
- **JSON**: 2 spaces per level

#### 3.4.2. Line Length
- Soft limit of 100 characters
- Break long JSX props onto multiple lines

#### 3.4.3. Quotes
- Single quotes for strings
- Template literals for string interpolation

---

## 4. Structure of the Code

### 4.1. Directory Structure

```
disaster-connect/
├── frontend/                    # React Native mobile app
│   ├── App.js                   # Root component with providers
│   ├── app.json                 # Expo configuration
│   ├── package.json             # Frontend dependencies
│   └── src/
│       ├── api/                 # API service modules
│       ├── auth/                # Authentication context & hooks
│       ├── components/common/   # Reusable UI components
│       ├── config/              # App configuration
│       ├── hooks/               # Custom React hooks
│       ├── navigation/          # Navigation setup
│       ├── screens/             # Screen components
│       │   ├── admin/           # Admin panel screens
│       │   ├── auth/            # Login/Register screens
│       │   ├── donation/        # Donation screens
│       │   ├── lostfound/       # Lost & Found screens
│       │   ├── main/            # Core app screens
│       │   └── shelter/         # Shelter management screens
│       ├── services/            # Business logic services
│       ├── theme/               # Theming configuration
│       └── utils/               # Utility functions
│
├── backend/                     # Node.js/Express API server
│   ├── server.js                # Entry point, Express setup
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables
│   ├── confiq/                  # Database configuration
│   ├── controllers/             # Route handlers
│   ├── middleware/              # Express middleware
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API route definitions
│   ├── services/                # Business logic services
│   ├── uploads/                 # Uploaded files storage
│   └── utils/                   # Utility functions
│
└── README.md                    # Project documentation
```

### 4.2. Important Files and Folders

#### 4.2.1. Controllers (`backend/controllers/`)
Each resource has a dedicated controller handling CRUD operations:
- `authController.js` - User registration, login, token refresh
- `userController.js` - Profile management, user listing
- `disasterController.js` - Disaster reporting and management
- `shelterController.js` - Shelter CRUD and nearby search
- `notificationController.js` - Push notification sending
- `lostFoundController.js` - Lost & found item management
- `donationController.js` - Donation tracking

#### 4.2.2. Models (`backend/models/`)
Mongoose schemas defining database structure:
- `User.js` - User accounts with roles (user, volunteer, admin)
- `DisasterReport.js` - Disaster reports with geolocation
- `Shelter.js` - Emergency shelter information
- `LostFound.js` - Lost and found items
- `Donation.js` - Donation records
- `Alert.js` - Emergency alerts
- `UserNotification.js` - Notification inbox

#### 4.2.3. Screens (`frontend/src/screens/`)
Organized by feature domain:
- **main/**: `HomeScreen`, `ProfileScreen`, `ViewMapScreen`, `ReportDisasterScreen`
- **admin/**: `AdminDashboardScreen`, `ManageDisastersScreen`, `AdminUsersScreen`
- **shelter/**: `ShelterListScreen`, `ShelterDetailScreen`, `AddShelterScreen`
- **lostfound/**: `LostFoundDashboard`, `ReportLostItemScreen`, `ReportFoundItemScreen`
- **auth/**: `LoginScreen`, `RegisterScreen`

#### 4.2.4. Common Components (`frontend/src/components/common/`)
Reusable UI building blocks:
- `AppButton.js` - Styled button component
- `AppCard.js` - Card container with theming
- `AppHeader.js` - Screen header with navigation
- `AppInput.js` - Themed text input
- `AppLoader.js` - Loading spinner overlay
- `LocationPermissionPrompt.js` - Location permission handler

#### 4.2.5. Navigation (`frontend/src/navigation/`)
- `MainNavigator.js` - Bottom tab navigation with nested stacks
- `AdminNavigator.js` - Admin-specific navigation
- `AuthNavigator.js` - Authentication flow
- `AppNavigator.js` - Root navigator with auth state handling

### 4.3. Entry Points

#### 4.3.1. Backend Entry (`server.js`)
All HTTP requests funnel through `server.js`, which:
- Loads environment variables via `dotenv`
- Connects to MongoDB database
- Configures Express middleware (CORS, JSON parsing)
- Mounts API routes
- Starts the HTTP server on port 5000

#### 4.3.2. Frontend Entry (`App.js`)
The root React component that:
- Sets up the Paper theme provider
- Wraps the app in authentication context
- Configures the navigation container
- Initializes push notification listeners

---

## 5. Version Control

### 5.1. Git Workflow
The project uses Git for version control with GitHub as the remote repository.

- **Commit Messages**: Descriptive, imperative style (e.g., "Add shelter search feature", "Fix notification token registration")
- **Branching**: Feature branches for new development
- **Main Branch**: Stable, deployable code

---

## 6. Dependencies

### 6.1. Frontend Dependencies

| Package | Purpose |
|---------|---------|
| `expo` (~54.0.30) | Core Expo SDK and development tools |
| `react` (19.1.0) | React library for UI components |
| `react-native` (0.81.5) | Mobile app framework |
| `@react-navigation/*` | Navigation between screens |
| `react-native-paper` | Material Design UI components |
| `react-native-maps` | Map display and markers |
| `axios` | HTTP API client |
| `expo-location` | GPS and geolocation |
| `expo-image-picker` | Camera and image selection |
| `expo-notifications` | Push notification handling |
| `@react-native-async-storage/async-storage` | Local data persistence |
| `@expo/vector-icons` | Icon library |

### 6.2. Backend Dependencies

| Package | Purpose |
|---------|---------|
| `express` (^5.1.0) | Web framework for API |
| `mongoose` (^8.19.1) | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT authentication |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable loading |
| `multer` | File upload handling |
| `expo-server-sdk` | Push notification sending |
| `firebase-admin` | Firebase services (FCM) |
| `nodemon` (dev) | Auto-restart during development |

---

## 7. Testing During Construction

### Test Case TC-01: User Registration
| Field | Value |
|-------|-------|
| **Description** | User can register a new account |
| **Primary Actor** | User |
| **Preconditions** | System running, valid email not already registered |
| **Input Data** | Name, email, password, role |
| **Expected Result** | Account created, JWT token returned |
| **Actual Result** | Account created successfully |
| **Priority** | High |
| **Status** | ✅ Passed |

### Test Case TC-02: User Login
| Field | Value |
|-------|-------|
| **Description** | User can log into the system |
| **Primary Actor** | User, Volunteer, Admin |
| **Preconditions** | User has valid credentials |
| **Input Data** | Email, password |
| **Expected Result** | JWT token returned, user redirected to home |
| **Actual Result** | Login successful |
| **Priority** | High |
| **Status** | ✅ Passed |

### Test Case TC-03: Report Disaster
| Field | Value |
|-------|-------|
| **Description** | User can report a disaster with location |
| **Primary Actor** | User, Volunteer |
| **Preconditions** | User logged in, location permission granted |
| **Input Data** | Type, description, severity, coordinates, image |
| **Expected Result** | Disaster saved, appears on map |
| **Actual Result** | Disaster reported and displayed |
| **Priority** | High |
| **Status** | ✅ Passed |

### Test Case TC-04: View Nearby Shelters
| Field | Value |
|-------|-------|
| **Description** | User can view shelters near their location |
| **Primary Actor** | User |
| **Preconditions** | Location permission granted |
| **Input Data** | User's GPS coordinates |
| **Expected Result** | List of shelters sorted by distance |
| **Actual Result** | Shelters displayed correctly |
| **Priority** | High |
| **Status** | ✅ Passed |

### Test Case TC-05: Admin Manage Shelters
| Field | Value |
|-------|-------|
| **Description** | Admin can add, edit, delete shelters |
| **Primary Actor** | Admin |
| **Preconditions** | Admin logged in |
| **Input Data** | Shelter details (name, address, capacity, facilities) |
| **Expected Result** | CRUD operations succeed |
| **Actual Result** | All operations functional |
| **Priority** | Medium |
| **Status** | ✅ Passed |

### Test Case TC-06: Push Notifications
| Field | Value |
|-------|-------|
| **Description** | Admin can send push notifications to users |
| **Primary Actor** | Admin |
| **Preconditions** | Users have registered FCM tokens |
| **Input Data** | Notification title, body |
| **Expected Result** | Notifications delivered to devices |
| **Actual Result** | Notifications received |
| **Priority** | High |
| **Status** | ✅ Passed |

### Test Case TC-07: Lost & Found Reporting
| Field | Value |
|-------|-------|
| **Description** | User can report lost or found items |
| **Primary Actor** | User |
| **Preconditions** | User logged in |
| **Input Data** | Item details, location, image |
| **Expected Result** | Item appears in dashboard |
| **Actual Result** | Items listed correctly |
| **Priority** | Medium |
| **Status** | ✅ Passed |

---

## 8. Code Refactoring

### 8.1. Component Extraction
Complex screens were refactored into smaller, reusable components:
- Extracted `AppButton`, `AppCard`, `AppInput`, `AppLoader` as common components
- Split `ShelterDetailScreen` into `ShelterCard`, `ShelterMapView`, `FacilitiesList`, `ContactInfo`
- Created dedicated component folders within screen directories

### 8.2. Theme Centralization
All colors and styling consolidated into `theme/index.js`:
```javascript
export const theme = {
  colors: {
    primary: '#00695C',      // Deep Teal
    secondary: '#D32F2F',    // Alert Red
    success: '#27ae60',
    warning: '#f39c12',
    severity: { low, medium, high, critical },
    role: { admin, volunteer, user }
  }
};
```

### 8.3. API Layer Refactoring
Centralized API calls into service modules:
- `api/disasters.js` - Disaster CRUD operations
- `api/shelters.js` - Shelter operations
- `api/auth.js` - Authentication endpoints

### 8.4. Navigation Restructuring
Organized navigation into nested stacks:
- `HomeStack` → Home, ReportDisaster, ViewMap, Notifications, Donate
- `ShelterStack` → ShelterList, ShelterDetail, AddShelter
- `ProfileStack` → Profile, EditProfile
- `LostFoundStack` → Dashboard, ReportLost, ReportFound

### 8.5. Error Handling Standardization
- Implemented `asyncHandler` middleware for consistent error catching
- Created global `errorHandler` middleware for uniform error responses
- Added loading states and error displays across all screens

---

## 9. Configuration

### 9.1. Environment Variables

**Backend (`.env`):**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/disaster-connect
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d
```

**Frontend (`app.json`):**
Contains Expo configuration including:
- App name and slug
- SDK version
- Android/iOS specific settings
- Push notification configuration

### 9.2. Role-Based Access Control

The application implements three user roles:
- **User**: Can report disasters, view shelters, use lost & found
- **Volunteer**: Same as user with additional capabilities
- **Admin**: Full access including user management, shelter CRUD, notification sending

### 9.3. Security Configuration
- JWT authentication with expiration
- Password hashing with bcrypt (12 rounds)
- CORS enabled for mobile app access
- Protected routes via auth middleware
- Sensitive fields excluded from API responses (`password`, `fcmToken`)

---

## 10. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/disasters` | Get all disasters |
| POST | `/api/disasters` | Report new disaster |
| GET | `/api/shelters` | Get nearby shelters |
| POST | `/api/shelters` | Add new shelter (admin) |
| POST | `/api/notifications/send` | Send push notification (admin) |
| GET | `/api/notifications/inbox` | Get user's notifications |
| GET | `/api/lost-found` | Get lost & found items |
| POST | `/api/lost-found` | Report lost/found item |
| GET | `/api/donations` | Get donations list |
| POST | `/api/donations` | Create donation record |

---

*Document Generated: January 2026*
*Project: Disaster Connect - Emergency Response Mobile Application*
