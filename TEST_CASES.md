# Project Test Cases

**Table 01: Registration**

| **Test case ID:** | **TC-01** |
| :--- | :--- |
| **Test Case Name:** | User Registration |
| **Test Case Description:** | Verify that a new user can successfully create an account in the system |
| **Primary Actor:** | `<Guest>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User taps "Sign Up" button and enters valid Name, Email, Password, Role | |
| 2- | | System validates input, creates account, generates token, and navigates to Dashboard |
| 3- | User lands on Home Screen | |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>Email must not exist in database. |
| **Input Data:** | Name, Valid Email, Password, Role |
| **Expected Result:** | User successfully registered and logged in. |
| **Actual Result:** | User successfully registered and logged in. |
| **Priority:** | High |
| **Frequency:** | Low |
| **Test Acceptance:** | Passed |

---

**Table 02: Login**

| **Test case ID:** | **TC-02** |
| :--- | :--- |
| **Test Case Name:** | Process Login |
| **Test Case Description:** | This Test case describes that user can log-in into the system |
| **Primary Actor:** | `<User> <Admin> <Volunteer>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User enter email and password | |
| 2- | | System process and verifies credentials and home screen is shown to the user |
| 3- | Step 1-2 repeats if user repeat the process | |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>User must have valid email and password |
| **Input Data:** | User email and password |
| **Expected Result:** | User successfully log-into the system. |
| **Actual Result:** | User successfully logged into the system |
| **Priority:** | High. |
| **Frequency:** | Most frequent |
| **Test Acceptance:** | Passed |

---

**Table 03: Profile Update**

| **Test case ID:** | **TC-03** |
| :--- | :--- |
| **Test Case Name:** | Update User Profile |
| **Test Case Description:** | Verify that a logged-in user can update their personal profile information |
| **Primary Actor:** | `<User>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User navigates to Profile and edits Name/Phone | |
| 2- | | System validates changes and updates database record |
| 3- | User saves changes | System displays updated profile information |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>User must be logged in. |
| **Input Data:** | New Name, New Phone Number |
| **Expected Result:** | Profile updated successfully in database and UI. |
| **Actual Result:** | Profile updated successfully. |
| **Priority:** | Medium |
| **Frequency:** | Low |
| **Test Acceptance:** | Passed |

---

**Table 04: Report Disaster**

| **Test case ID:** | **TC-04** |
| :--- | :--- |
| **Test Case Name:** | Report Disaster |
| **Test Case Description:** | Verify that a user can report a disaster incident with geolocation |
| **Primary Actor:** | `<User> <Volunteer>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User selects "Report Disaster", picks location and type | |
| 2- | | System captures GPS coordinates and opens details form |
| 3- | User submits report | System saves report to database and updates map |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>Location permission must be granted. |
| **Input Data:** | Disaster Type, Location, Description, Severity |
| **Expected Result:** | Disaster report saved and visible on map. |
| **Actual Result:** | Disaster reported successfully. |
| **Priority:** | High |
| **Frequency:** | Medium |
| **Test Acceptance:** | Passed |

---

**Table 05: View Map**

| **Test case ID:** | **TC-05** |
| :--- | :--- |
| **Test Case Name:** | View Disaster Map |
| **Test Case Description:** | Verify that reported disasters are correctly rendered on the map |
| **Primary Actor:** | `<User>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User navigates to "Map View" | |
| 2- | | System loads map tiles and fetches disaster data |
| 3- | User views markers | System renders markers at correct coordinates |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>Internet connection required. |
| **Input Data:** | N/A (View Action) |
| **Expected Result:** | Map displays correct markers for disasters. |
| **Actual Result:** | Map and markers displayed correctly. |
| **Priority:** | High |
| **Frequency:** | High |
| **Test Acceptance:** | Passed |

---

**Table 06: Nearby Shelters**

| **Test case ID:** | **TC-06** |
| :--- | :--- |
| **Test Case Name:** | View Nearby Shelters |
| **Test Case Description:** | Verify that shelters are displayed sorted by distance to user |
| **Primary Actor:** | `<User>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User opens "Shelters" tab | |
| 2- | | System calculates distances and sorts shelters |
| 3- | User views list | System displays nearest shelters first |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>User location known. |
| **Input Data:** | User GPS Coordinates |
| **Expected Result:** | Shelters listed in ascending order of distance. |
| **Actual Result:** | Nearby shelters displayed successfully. |
| **Priority:** | High |
| **Frequency:** | High |
| **Test Acceptance:** | Passed |

---

**Table 07: Add Shelter**

| **Test case ID:** | **TC-07** |
| :--- | :--- |
| **Test Case Name:** | Add New Shelter (Admin) |
| **Test Case Description:** | Verify that an admin can add a new shelter to the system |
| **Primary Actor:** | `<Admin>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | Admin fills shelter details form and location | |
| 2- | | System validates input fields |
| 3- | Admin taps "Create" | System saves new shelter to database |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>Admin privileges required. |
| **Input Data:** | Name, Capacity, Address, Facilities |
| **Expected Result:** | Shelter added and searchable by users. |
| **Actual Result:** | Shelter added successfully. |
| **Priority:** | High |
| **Frequency:** | Low |
| **Test Acceptance:** | Passed |

---

**Table 08: Lost & Found**

| **Test case ID:** | **TC-08** |
| :--- | :--- |
| **Test Case Name:** | Report Lost Item |
| **Test Case Description:** | Verify that a user can post a lost item report |
| **Primary Actor:** | `<User>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User uploads photo and enters item details | |
| 2- | | System processes image and text |
| 3- | User submits report | System creates "Lost" item record |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>User logged in. |
| **Input Data:** | Item Name, Image, Description |
| **Expected Result:** | Item appears in lost & found feed. |
| **Actual Result:** | Item reported successfully. |
| **Priority:** | Medium |
| **Frequency:** | Medium |
| **Test Acceptance:** | Passed |

---

**Table 09: Donations**

| **Test case ID:** | **TC-09** |
| :--- | :--- |
| **Test Case Name:** | Process Donation Pledge |
| **Test Case Description:** | Verify that a user can submit a donation pledge |
| **Primary Actor:** | `<User>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | User enters amount and message | |
| 2- | | System validates amount > 0 |
| 3- | User confirms donation | System records pledge in history |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state. |
| **Input Data:** | Amount, Message |
| **Expected Result:** | Donation successfully recorded. |
| **Actual Result:** | Donation pledged successfully. |
| **Priority:** | Medium |
| **Frequency:** | Low |
| **Test Acceptance:** | Passed |

---

**Table 10: Push Notifications**

| **Test case ID:** | **TC-10** |
| :--- | :--- |
| **Test Case Name:** | Send Push Notification Broadcast |
| **Test Case Description:** | Verify that an admin can send alerts to all users |
| **Primary Actor:** | `<Admin>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | Admin composes title and body | |
| 2- | Admin sends alert | System pushes notification to all registered tokens |
| 3- | | System confirms delivery count |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>FCM tokens registered. |
| **Input Data:** | Title, Message Body |
| **Expected Result:** | Users receive notification on device. |
| **Actual Result:** | Notification delivered successfully. |
| **Priority:** | High |
| **Frequency:** | Low |
| **Test Acceptance:** | Passed |

---

**Table 11: Admin Stats**

| **Test case ID:** | **TC-11** |
| :--- | :--- |
| **Test Case Name:** | Admin Dashboard Statistics |
| **Test Case Description:** | Verify that admin dashboard shows correct counts |
| **Primary Actor:** | `<Admin>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | Admin logs in to Dashboard | |
| 2- | | System aggregates data from database |
| 3- | Admin views cards | System displays correct counts for Users/Disasters |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>Data exists in DB. |
| **Input Data:** | N/A |
| **Expected Result:** | Statistics match database records. |
| **Actual Result:** | Statistics displayed correctly. |
| **Priority:** | Low |
| **Frequency:** | High |
| **Test Acceptance:** | Passed |

---

**Table 12: Delete User**

| **Test case ID:** | **TC-12** |
| :--- | :--- |
| **Test Case Name:** | Admin Delete User |
| **Test Case Description:** | Verify than an admin can delete a user account |
| **Primary Actor:** | `<Admin>` |

**Main success scenario:**

| | **User Action** | **System Response** |
| :--- | :--- | :--- |
| 1- | Admin selects user from list | |
| 2- | | System prompts for confirmation |
| 3- | Admin confirms delete | System removes user record and updates list |

**Testing Requirement:**

| | |
| :--- | :--- |
| **Testing Condition:** | System must be in running state.<br>Admin privileges. |
| **Input Data:** | User ID |
| **Expected Result:** | User permanently removed. |
| **Actual Result:** | User deleted successfully. |
| **Priority:** | High |
| **Frequency:** | Low |
| **Test Acceptance:** | Passed |
