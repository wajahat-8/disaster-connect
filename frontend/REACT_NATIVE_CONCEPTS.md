# React Native Developer Pro Roadmap 🚀

A comprehensive guide to mastering React Native development.

---

## 1. JavaScript & ES6+ Fundamentals

| Concept | Description |
|---------|-------------|
| **Arrow Functions** | `() => {}` syntax, lexical `this` binding |
| **Destructuring** | Extract values from objects/arrays |
| **Spread/Rest Operators** | `...` for copying and collecting |
| **Template Literals** | `` `Hello ${name}` `` |
| **Promises & Async/Await** | Asynchronous programming |
| **Modules** | `import/export` syntax |
| **Array Methods** | `map`, `filter`, `reduce`, `find`, `some`, `every` |
| **Optional Chaining** | `user?.profile?.name` |
| **Nullish Coalescing** | `value ?? defaultValue` |

---

## 2. React Core Concepts

### Component Types
```javascript
// Functional Component (Modern - USE THIS)
const MyComponent = ({ title }) => {
  return <Text>{title}</Text>;
};

// Class Component (Legacy)
class MyComponent extends React.Component {
  render() {
    return <Text>{this.props.title}</Text>;
  }
}
```

### Essential Hooks
| Hook | Purpose |
|------|---------|
| `useState` | Local state management |
| `useEffect` | Side effects (API calls, subscriptions) |
| `useContext` | Access context values |
| `useRef` | Mutable refs, DOM access |
| `useMemo` | Memoize expensive calculations |
| `useCallback` | Memoize functions |
| `useReducer` | Complex state logic |
| `useLayoutEffect` | Synchronous layout effects |

### Props & State
- **Props**: Read-only data passed from parent
- **State**: Mutable data managed within component
- **Lifting State**: Move state to common ancestor
- **Prop Drilling**: Passing props through multiple levels (avoid with Context)

### Component Lifecycle (with Hooks)
```javascript
useEffect(() => {
  // componentDidMount + componentDidUpdate
  console.log('Component mounted or updated');
  
  return () => {
    // componentWillUnmount (cleanup)
    console.log('Cleanup');
  };
}, [dependencies]); // Empty array = mount only
```

---

## 3. React Native Core Components

### Basic Components
| Component | Purpose |
|-----------|---------|
| `View` | Container (like `div`) |
| `Text` | Display text (required for all text) |
| `Image` | Display images |
| `ScrollView` | Scrollable container |
| `TextInput` | User text input |
| `TouchableOpacity` | Touchable with opacity feedback |
| `Pressable` | Modern touchable (preferred) |
| `Button` | Basic button |
| `Switch` | Toggle switch |
| `ActivityIndicator` | Loading spinner |

### List Components
| Component | Use Case |
|-----------|----------|
| `FlatList` | Long lists (virtualized) |
| `SectionList` | Grouped/sectioned lists |
| `ScrollView` | Short lists only |

```javascript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <ItemComponent item={item} />}
  ListEmptyComponent={<EmptyState />}
  ListHeaderComponent={<Header />}
  ListFooterComponent={<Footer />}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  refreshing={isRefreshing}
  onRefresh={handleRefresh}
/>
```

### Layout & Styling
```javascript
// StyleSheet API
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',      // 'column' (default)
    justifyContent: 'center',  // main axis
    alignItems: 'center',      // cross axis
    padding: 16,
  },
});
```

**Flexbox Properties:**
- `flex`, `flexDirection`, `flexWrap`
- `justifyContent`: flex-start, flex-end, center, space-between, space-around
- `alignItems`, `alignSelf`: flex-start, flex-end, center, stretch

---

## 4. Navigation (React Navigation)

### Stack Navigator
```javascript
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

<Stack.Navigator initialRouteName="Home">
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Details" component={DetailsScreen} />
</Stack.Navigator>
```

### Tab Navigator
```javascript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

### Drawer Navigator
```javascript
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

<Drawer.Navigator>
  <Drawer.Screen name="Home" component={HomeScreen} />
</Drawer.Navigator>
```

### Navigation Actions
```javascript
// Navigate to screen
navigation.navigate('ScreenName', { param: value });

// Go back
navigation.goBack();

// Reset navigation state
navigation.reset({
  index: 0,
  routes: [{ name: 'Home' }],
});

// Get params
const { param } = route.params;
```

---

## 5. State Management

### Context API
```javascript
// Create context
const AuthContext = createContext();

// Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
const useAuth = () => useContext(AuthContext);
```

### Redux Toolkit
```javascript
// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false },
  reducers: {
    setUser: (state, action) => { state.data = action.payload; },
  },
});

// Store
const store = configureStore({
  reducer: { user: userSlice.reducer },
});

// Usage
const user = useSelector(state => state.user.data);
const dispatch = useDispatch();
dispatch(setUser(userData));
```

### Other Options
- **Zustand** - Simple, lightweight
- **Jotai** - Atomic state management
- **React Query / TanStack Query** - Server state management

---

## 6. API & Networking

### Fetch API
```javascript
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ key: 'value' }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Interceptors
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Storage & Persistence

| Library | Use Case |
|---------|----------|
| `AsyncStorage` | Simple key-value storage |
| `MMKV` | High-performance storage |
| `SQLite` | Complex relational data |
| `Realm` | Mobile database |
| `SecureStore` | Sensitive data (Expo) |

```javascript
// AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('key', JSON.stringify(value));
const value = JSON.parse(await AsyncStorage.getItem('key'));
await AsyncStorage.removeItem('key');
```

---

## 8. Platform-Specific Code

```javascript
import { Platform } from 'react-native';

// Inline
const styles = {
  padding: Platform.OS === 'ios' ? 20 : 16,
  ...Platform.select({
    ios: { shadowColor: 'black' },
    android: { elevation: 4 },
  }),
};

// File-based
// Component.ios.js
// Component.android.js
```

---

## 9. Native Modules & Linking

### Using Native Modules
```javascript
// Camera, Location, etc.
import { Camera } from 'react-native-camera';
import Geolocation from '@react-native-community/geolocation';
import { launchImageLibrary } from 'react-native-image-picker';
```

### Common Native Libraries
| Library | Purpose |
|---------|---------|
| `react-native-maps` | Maps integration |
| `react-native-camera` | Camera access |
| `react-native-image-picker` | Image selection |
| `react-native-permissions` | Permission handling |
| `react-native-push-notification` | Push notifications |
| `react-native-gesture-handler` | Advanced gestures |
| `react-native-reanimated` | Performant animations |

---

## 10. Animations

### Animated API
```javascript
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true,
}).start();

<Animated.View style={{ opacity: fadeAnim }}>
  <Text>Fading in</Text>
</Animated.View>
```

### Reanimated (Recommended for complex animations)
```javascript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const offset = useSharedValue(0);

const animatedStyles = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(offset.value) }],
}));
```

---

## 11. Forms & Validation

### React Hook Form
```javascript
import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit, errors } = useForm();

<Controller
  control={control}
  name="email"
  rules={{ required: true, pattern: /^\S+@\S+$/i }}
  render={({ field: { onChange, value } }) => (
    <TextInput value={value} onChangeText={onChange} />
  )}
/>
```

### Formik + Yup
```javascript
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});
```

---

## 12. Testing

| Type | Tools |
|------|-------|
| **Unit Testing** | Jest |
| **Component Testing** | React Native Testing Library |
| **E2E Testing** | Detox, Appium |

```javascript
// Jest + RNTL
import { render, fireEvent } from '@testing-library/react-native';

test('button press', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button onPress={onPress} title="Press Me" />);
  
  fireEvent.press(getByText('Press Me'));
  expect(onPress).toHaveBeenCalled();
});
```

---

## 13. Performance Optimization

### Key Techniques
- **useMemo / useCallback** - Prevent unnecessary recalculations
- **React.memo** - Memoize components
- **FlatList optimization** - `keyExtractor`, `getItemLayout`, `removeClippedSubviews`
- **Image optimization** - Use `resizeMode`, cache images
- **Avoid inline functions** in render
- **Use Hermes** - Optimized JS engine

### Profiling Tools
- React DevTools
- Flipper
- Systrace (Android)
- Instruments (iOS)

---

## 14. Debugging & DevTools

| Tool | Purpose |
|------|---------|
| **React DevTools** | Component inspection |
| **Flipper** | All-in-one debugging |
| **Reactotron** | State and API inspection |
| **Chrome DevTools** | JavaScript debugging |
| **LogBox** | Error/warning display |

---

## 15. Deployment & CI/CD

### Build Commands
```bash
# iOS
npx react-native run-ios --configuration Release
cd ios && xcodebuild -workspace App.xcworkspace -scheme App

# Android
cd android && ./gradlew assembleRelease
```

### App Stores
- **iOS**: App Store Connect, TestFlight
- **Android**: Google Play Console

### CI/CD Platforms
- **EAS Build** (Expo)
- **Fastlane**
- **GitHub Actions**
- **Bitrise**
- **App Center**

---

## 16. Project Architecture

### Recommended Folder Structure
```
src/
├── api/              # API clients, services
├── assets/           # Images, fonts
├── components/       # Reusable components
│   ├── common/       # Buttons, inputs, etc.
│   └── specific/     # Feature-specific
├── constants/        # App constants
├── context/          # React contexts
├── hooks/            # Custom hooks
├── navigation/       # Navigation setup
├── screens/          # Screen components
├── services/         # Business logic
├── store/            # State management
├── theme/            # Styling, colors
├── types/            # TypeScript types
└── utils/            # Helper functions
```

### Best Practices
- ✅ Single Responsibility Principle
- ✅ Container/Presenter pattern
- ✅ Custom hooks for logic reuse
- ✅ Consistent naming conventions
- ✅ Error boundaries for crash handling
- ✅ Environment-based configuration

---

## 17. TypeScript (Highly Recommended)

```typescript
// Props typing
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return <Pressable onPress={onPress} disabled={disabled}>...</Pressable>;
};

// Navigation typing
type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number };
};

const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
```

---

## 18. Security Best Practices

- 🔐 Never store secrets in code
- 🔐 Use secure storage for sensitive data
- 🔐 Implement certificate pinning
- 🔐 Validate all inputs
- 🔐 Use HTTPS only
- 🔐 Implement proper authentication flows
- 🔐 Obfuscate production builds

---

## 📚 Learning Path

1. **Beginner**: JavaScript ES6+ → React basics → Core components → Styling
2. **Intermediate**: Navigation → State management → API integration → Storage
3. **Advanced**: Native modules → Animations → Performance → Testing
4. **Pro**: Architecture → TypeScript → Security → CI/CD → Publishing

---

> **Pro Tip**: Build real projects! Theory alone won't make you a pro. Apply each concept in actual apps.

Happy Coding! 🎉
