# React Native Concepts Used in Disaster Connect App

A comprehensive guide to all React Native concepts, patterns, and APIs used in this application with real examples from your code.

---

## 1. **Core React Concepts**

### 1.1 Functional Components
**What it is:** A component written as a JavaScript function that returns JSX (the UI).

**Used in:** Every screen and navigator in your app.

```javascript
// From HomeScreen.js
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome</Text>
    </View>
  );
};
export default HomeScreen;
```

**Key Points:**
- Simpler and more modern than class components
- Takes props as arguments
- Must return JSX or null

---

### 1.2 Hooks - `useState`
**What it is:** A React Hook that lets you add state to functional components.

**Used in:** LoginScreen, RegisterScreen, EditProfileScreen.

```javascript
// From LoginScreen.js
const [form, setForm] = useState({ email: '', password: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

**What happens:**
- `useState` creates a state variable and a function to update it
- Returns `[currentValue, functionToUpdate]`
- When you call the update function, React re-renders the component with the new value

**Example:**
```javascript
const [count, setCount] = useState(0);
setCount(count + 1); // Updates state and triggers re-render
```

---

### 1.3 Hooks - `useContext`
**What it is:** A React Hook that lets you access context (global state) without prop drilling.

**Used in:** Every screen that needs user/auth data.

```javascript
// From HomeScreen.js
const { user, logout } = useAuth();

// useAuth is a custom hook that wraps useContext
export const useAuth = () => useContext(AuthContext);
```

**Why it matters:**
- Without context, you'd have to pass data through every component level ("prop drilling")
- Context provides a way to share data globally

**Example flow in your app:**
```
App.js (provides AuthProvider) 
  → LoginScreen (uses useAuth to get login function)
  → AuthContext (context provider)
```

---

### 1.4 Hooks - `useEffect`
**What it is:** A Hook that runs side effects (like fetching data, checking auth state).

**Used in:** AuthContext.js for checking stored auth state on app load.

```javascript
// From AuthContext.js
useEffect(() => {
  checkAuthState();
}, []); // Empty dependency array = runs once on mount

// This also runs when token changes
useEffect(() => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}, [token]); // Dependency array = runs when 'token' changes
```

**Dependency array explained:**
- `[]` = runs once when component mounts
- `[token]` = runs when `token` changes
- No array = runs after every render (usually bad!)
- Can cause infinite loops if not used carefully

---

## 2. **React Native Components (UI Building Blocks)**

### 2.1 `View`
**What it is:** The basic building block for layouts in React Native. Like a `<div>` in web.

```javascript
// From HomeScreen.js
<View style={styles.container}>
  <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
</View>
```

**Properties:**
- `style` - apply StyleSheet styles
- `children` - can contain other components
- No text can go directly inside; use `<Text>` for text

---

### 2.2 `Text`
**What it is:** Displays text content. You MUST use `<Text>` for all text, not `<View>`.

```javascript
// From HomeScreen.js
<Text style={styles.welcome}>Welcome, {user?.name}!</Text>
```

**Why this matters:**
- React Native doesn't allow raw text in Views
- Text has specific properties like `numberOfLines`, `ellipsizeMode`

---

### 2.3 `TextInput`
**What it is:** A component for entering text (like `<input>` in web).

```javascript
// From LoginScreen.js
<TextInput
  style={styles.input}
  placeholder="Email"
  value={form.email}
  onChangeText={(t) => setForm({ ...form, email: t })}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

**Key props:**
- `placeholder` - hint text
- `value` - current value (controlled component)
- `onChangeText` - called when user types (with the new text)
- `keyboardType` - "email-address", "phone-pad", "number-pad", "default"
- `secureTextEntry` - hides text (for passwords)
- `autoCapitalize` - "none", "sentences", "words", "characters"

---

### 2.4 `TouchableOpacity`
**What it is:** A wrapper that responds to touches. When pressed, it decreases opacity of the view.

```javascript
// From HomeScreen.js
<TouchableOpacity
  style={styles.menuItem}
  onPress={() => navigation.navigate('Profile')}
>
  <Text style={styles.menuText}>My Profile</Text>
</TouchableOpacity>
```

**Key props:**
- `onPress` - called when user taps
- `disabled` - disable the button
- `style` - apply styles (opacity decreases on press)

**Alternatives:**
- `Pressable` - more modern, more flexible
- `Button` - basic button with text
- `View` + `GestureResponder` - for advanced gestures

---

### 2.5 `ScrollView`
**What it is:** Renders scrollable content. Useful when content exceeds screen height.

```javascript
// From RegisterScreen.js
<ScrollView contentContainerStyle={styles.container}>
  <TextInput ... />
  <TextInput ... />
  <TextInput ... />
  <TextInput ... />
  <Button ... />
</ScrollView>
```

**Key props:**
- `contentContainerStyle` - styles for the scroll container (not the wrapper)
- `showsVerticalScrollIndicator` - show/hide scrollbar (iOS)
- `horizontal` - scroll horizontally instead of vertically

**Note:** In your EditProfileScreen, you use `ScrollView` inside `KeyboardAvoidingView` to handle both keyboard and overflow.

---

### 2.6 `KeyboardAvoidingView`
**What it is:** Automatically adjusts the view when keyboard appears so content isn't hidden.

```javascript
// From RegisterScreen.js
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <ScrollView>
    {/* TextInputs and other content */}
  </ScrollView>
</KeyboardAvoidingView>
```

**How it works:**
- On iOS: uses "padding" behavior (adds space)
- On Android: uses default behavior (scrolls automatically)
- Essential when you have forms with TextInputs

---

### 2.7 `ActivityIndicator`
**What it is:** A loading spinner. Shows while data is being fetched.

```javascript
// From AppNavigator.js
if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
}
```

**Key props:**
- `size` - "small" or "large"
- `color` - spinner color
- `animating` - show/hide spinner

---

### 2.8 `Button`
**What it is:** A basic button component with platform-specific styling.

```javascript
// From LoginScreen.js
<Button
  title={loading ? 'Logging in...' : 'Login'}
  onPress={handleLogin}
  disabled={loading}
/>
```

**Key props:**
- `title` - button text
- `onPress` - callback when pressed
- `disabled` - disable the button
- `color` - button color

**Limitation:** Limited styling options. Use `TouchableOpacity` for custom buttons.

---

### 2.9 `FlatList` (Not used in current code, but common)
**What it is:** Efficiently renders large lists of items.

**Example (for your future use):**
```javascript
import { FlatList } from 'react-native';

<FlatList
  data={users}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <Text>{item.name}</Text>
  )}
/>
```

**Why:** FlatList only renders visible items, so large lists don't lag.

---

## 3. **Styling with StyleSheet**

### 3.1 `StyleSheet.create()`
**What it is:** Creates an optimized stylesheet for React Native components.

```javascript
// From HomeScreen.js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
});

// Use with style prop
<View style={styles.container}>
  <Text style={styles.welcome}>Welcome</Text>
</View>
```

**Key points:**
- All style values are strings or numbers
- No CSS (no hover, no media queries)
- Common properties:
  - `flex` - flex layout
  - `flexDirection` - "row" or "column" (default)
  - `justifyContent` - center, space-between, space-around, etc.
  - `alignItems` - center, flex-start, flex-end, stretch
  - `padding`, `margin`, `width`, `height`
  - `backgroundColor`, `color`, `fontSize`, `fontWeight`
  - `borderWidth`, `borderColor`, `borderRadius`

### 3.2 Conditional Styles
```javascript
// From HomeScreen.js
<TouchableOpacity
  style={[styles.menuItem, { backgroundColor: '#e74c3c' }]}
  onPress={logout}
>
  <Text style={styles.menuText}>Logout</Text>
</TouchableOpacity>

// Or with conditional logic
style={[styles.saveButton, loading && styles.saveButtonDisabled]}
```

---

## 4. **Navigation (React Navigation)**

### 4.1 `NavigationContainer`
**What it is:** The root component that wraps all navigation. Enables navigation between screens.

```javascript
// From AppNavigator.js
<NavigationContainer>
  {user ? <MainNavigator /> : <AuthNavigator />}
</NavigationContainer>
```

---

### 4.2 Stack Navigation
**What it is:** Screen stacking (like a stack of cards). New screens push on top.

```javascript
// From AuthNavigator.js
const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
```

**How it works:**
- `Stack.Navigator` - container
- `Stack.Screen` - individual screen
- `screenOptions` - configure header, animations, etc.
- `headerShown: false` - hide the default header

**Navigation:**
```javascript
navigation.navigate('Register') // Go to Register
navigation.goBack() // Go back to previous screen
```

---

### 4.3 Bottom Tab Navigation
**What it is:** Tabs at the bottom to switch between screens.

```javascript
// From MainNavigator.js
const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
```

**Navigation:**
```javascript
navigation.navigate('Profile') // Switch to Profile tab
```

---

### 4.4 Nested Navigation
**What it is:** Combining multiple navigators (stack inside tabs).

```javascript
// From MainNavigator.js
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }} 
      />
      <ProfileStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
      />
    </ProfileStack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
```

**Flow:**
```
Tabs
  → Home
  → Profile Stack
      → ProfileMain (can navigate to EditProfile)
      → EditProfile
```

---

### 4.5 Navigation Props
**What it is:** Every screen receives `navigation` prop for navigating.

```javascript
// From LoginScreen.js
export default function LoginScreen({ navigation }) {
  // navigation.navigate(), navigation.goBack(), etc.
  
  <Button 
    title="Register" 
    onPress={() => navigation.navigate('Register')} 
  />
}
```

**Common methods:**
- `navigation.navigate('ScreenName')` - go to screen
- `navigation.goBack()` - go back
- `navigation.reset()` - reset navigation stack (logout scenario)
- `navigation.push('ScreenName')` - push new instance

---

## 5. **State Management with Context API**

### 5.1 Creating Context
**What it is:** Global state that can be accessed from any component.

```javascript
// From AuthContext.js
export const AuthContext = createContext();
```

---

### 5.2 Context Provider
**What it is:** Provides context data to all child components.

```javascript
// From AuthContext.js
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ... functions like login(), logout(), etc.

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      login, 
      register, 
      logout, 
      // ... more values
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Usage in App:**
```javascript
// From App.js
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
```

**Now any child component can use `useAuth()` hook to access the data.**

---

### 5.3 Custom Hook for Context
**What it is:** A reusable hook to access context cleanly.

```javascript
// From AuthContext.js
export const useAuth = () => useContext(AuthContext);

// Usage in any component:
const { user, login, logout } = useAuth();
```

**Benefits:**
- Cleaner than `useContext(AuthContext)` everywhere
- Type-safe if using TypeScript
- Can add logic/validation in the hook

---

## 6. **Async Operations**

### 6.1 `async/await` with API Calls
**What it is:** Making network requests to your backend.

```javascript
// From AuthContext.js - Login
const login = async (email, password) => {
  try {
    const response = await api.post('/v1/auth/login', { 
      email, 
      password 
    });
    
    const { token: userToken, data } = response.data;
    
    await AsyncStorage.setItem('userToken', userToken);
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    setToken(userToken);
    setUser(data);
    
    return { success: true };
  } catch (error) {
    console.log('Login error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Login failed' 
    };
  }
};
```

**Pattern:**
- `try` - attempt API call
- `catch` - handle errors
- Return object with `{ success: boolean, error?: string, data?: any }`

---

### 6.2 `Alert` API
**What it is:** Shows native alert dialogs (OS-specific).

```javascript
// From LoginScreen.js
if (!result.success) {
  Alert.alert('Login Error', result.error || 'Login failed');
}
```

**Examples:**
```javascript
// Simple alert
Alert.alert('Title', 'Message');

// With buttons
Alert.alert(
  'Become a Volunteer',
  'Are you sure?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Yes', onPress: () => { /* do something */ } },
  ]
);
```

---

### 6.3 AsyncStorage (Local Storage)
**What it is:** Persistent key-value storage on the device.

```javascript
// From AuthContext.js
// Save data
await AsyncStorage.setItem('userToken', userToken);
await AsyncStorage.setItem('userData', JSON.stringify(data));

// Read data
const storedToken = await AsyncStorage.getItem('userToken');
const storedUser = await AsyncStorage.getItem('userData');

// Remove data
await AsyncStorage.removeItem('userToken');
```

**Use cases:**
- Store user token after login
- Save user preferences
- Persist data across app sessions

---

## 7. **Platform-Specific Code**

### 7.1 `Platform` API
**What it is:** Detects OS (iOS or Android) to run platform-specific code.

```javascript
// From RegisterScreen.js
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>

// From AppNavigator.js
paddingTop: Platform.OS === 'ios' ? 60 : 30
```

**Common patterns:**
```javascript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}

// Or
const platformSpecificStyle = {
  paddingTop: Platform.OS === 'ios' ? 50 : 20,
};
```

---

## 8. **Advanced Patterns Used**

### 8.1 Conditional Rendering
**What it is:** Showing/hiding UI based on conditions.

```javascript
// From HomeScreen.js
{user?.role === 'volunteer' && (
  <TouchableOpacity style={styles.menuItem}>
    <Text style={styles.menuText}>Volunteer Tasks</Text>
  </TouchableOpacity>
)}

{user?.role === 'admin' && (
  <>
    <TouchableOpacity>...</TouchableOpacity>
    <TouchableOpacity>...</TouchableOpacity>
  </>
)}
```

**Patterns:**
- `condition && <Component />` - render if true
- `condition ? <ComponentA /> : <ComponentB />` - render one or other
- Wrap multiple with `<>...</>` (Fragment)

---

### 8.2 Optional Chaining (`?.`)
**What it is:** Safely access nested properties that might not exist.

```javascript
// From HomeScreen.js
<Text>{user?.name}</Text>
<Text>{user?.role}</Text>

// Same as:
<Text>{user && user.name}</Text>
```

---

### 8.3 Nullish Coalescing (`??`)
**What it is:** Use default value if variable is null/undefined.

```javascript
// From AuthContext.js
error: error.response?.data?.message || 'Login failed'

// Also seen:
const { loading = false } = useAuth();
```

---

### 8.4 Destructuring
**What it is:** Extract specific values from objects/arrays.

```javascript
// From LoginScreen.js
const { login } = useAuth(); // Extract 'login' function

// In screens
const { user, token, login, logout } = useAuth();

// From API response
const { token: userToken, data } = response.data;
```

---

## 9. **Network Requests (Axios)**

### 9.1 Axios Instance
**What it is:** Pre-configured HTTP client for making API requests.

```javascript
// From api/apiClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.101:5000/api',
});

export default api;
```

---

### 9.2 Making Requests
**What it is:** Sending HTTP requests (GET, POST, PUT, DELETE).

```javascript
// POST (create data)
const response = await api.post('/v1/auth/login', { email, password });

// GET (fetch data)
const response = await api.get('/v1/admin/users');

// PUT (update data)
const response = await api.put('/v1/user/profile', profileData);

// DELETE (remove data)
await api.delete(`/v1/admin/users/${userId}`);
```

---

### 9.3 Setting Authorization Header
**What it is:** Adding authentication token to all requests.

```javascript
// From AuthContext.js
useEffect(() => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}, [token]);
```

**How it works:**
- Once token is set, all future requests include it
- Backend uses this token to verify user identity
- Token is removed on logout

---

## 10. **Summary of Component Hierarchy**

```
App.js (provides AuthProvider)
├── AuthProvider (global state)
│   └── AppNavigator
│       ├── NavigationContainer
│       ├── AuthNavigator (if not logged in)
│       │   ├── LoginScreen
│       │   └── RegisterScreen
│       └── MainNavigator (if logged in)
│           ├── HomeScreen
│           └── ProfileStackNavigator
│               ├── ProfileScreen
│               └── EditProfileScreen
└── All screens can access: useAuth() → { user, token, login, register, logout }
```

---

## 11. **Quick Concept Checklist**

- ✅ **Functional Components** - all screens are functional components
- ✅ **Hooks** - useState, useContext, useEffect used throughout
- ✅ **Styling** - StyleSheet.create() for all styles
- ✅ **Navigation** - Stack, Tabs, Nested navigation
- ✅ **Context API** - AuthContext for global auth state
- ✅ **Async/Await** - API calls and AsyncStorage operations
- ✅ **Conditional Rendering** - Show/hide based on user role
- ✅ **Platform Detection** - iOS vs Android handling
- ✅ **State Management** - useState for local, Context for global
- ✅ **Error Handling** - try/catch, Alert dialogs
- ✅ **API Integration** - Axios for HTTP requests
- ✅ **Keyboard Handling** - KeyboardAvoidingView, ScrollView combo

---

## 12. **Common React Native Patterns to Practice**

### Pattern 1: Form Input with State
```javascript
const [form, setForm] = useState({ email: '', password: '' });

<TextInput
  value={form.email}
  onChangeText={(t) => setForm({ ...form, email: t })}
/>
```

### Pattern 2: Loading and Error States
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

setLoading(true);
try {
  // do something
} catch (e) {
  setError(e.message);
} finally {
  setLoading(false);
}
```

### Pattern 3: Conditional Navigation
```javascript
{user ? <MainNavigator /> : <AuthNavigator />}
```

### Pattern 4: Role-Based UI
```javascript
{user?.role === 'admin' && <AdminComponent />}
{user?.role === 'volunteer' && <VolunteerComponent />}
```

---

## Resources to Learn More

- [React Native Official Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [React Context API](https://react.dev/reference/react/useContext)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Native Styling](https://reactnative.dev/docs/style)

---

This guide covers all major React Native concepts in your Disaster Connect app! 🚀
