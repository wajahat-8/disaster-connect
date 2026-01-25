# 4. Deployment and Feedback

## 1. Deployment Overview
The deployment of **Disaster Connect** focuses on delivering a resilient, responsive, and accessible mobile platform for disaster management and relief coordination. The system utilizes a robust client–server architecture where the frontend mobile application interacts with backend services via secure RESTful APIs.

Deployment is engineered to ensure high availability, particularly during critical disaster events, ensuring data integrity and a seamless user experience for victims, volunteers, and administrators. The application is deployed in a production environment following rigorous testing. The backend services handle user authentication, disaster reporting, shelter management, geolocation services, and real-time notifications, while the frontend provides a user-friendly interface for reporting incidents, locating safe havens, and managing resources.

## 2. Deployment Architecture
The deployment architecture of Disaster Connect consists of the following major components:

*   **Mobile Application (Client Side):**
    Developed using **React Native** and **Expo**, the mobile app is deployed on Android (and iOS) platforms. It provides critical features such as:
    *   **Disaster Reporting:** Allowing users to report incidents with location and images.
    *   **Shelter Locator:** Visualizing nearby shelters on a map using geolocation.
    *   **Lost & Found:** A platform for reporting and finding missing persons or items.
    *   **Donations & Volunteering:** Interfaces for resource mobilization.
    *   **Profile Management:** For victims, volunteers, and admins.

*   **Backend Server:**
    The backend is built with **Node.js** and **Express.js**, deployed on a scalable server environment (e.g., AWS EC2, DigitalOcean, or Heroku). It serves as the central processing unit responsible for:
    *   **API Gateway:** Handling all client requests.
    *   **Business Logic:** verification of reports, distance calculations for alerts, and user management.
    *   **Authentication:** Secure JWT-based access control.
    *   **Notification Service:** Integrating with Expo Notifications and Firebase for real-time alerts.

*   **Database Server:**
    A **MongoDB** database acts as the centralized storage unit. It securely stores:
    *   User profiles and authentication credentials.
    *   Disaster reports and geospatial data.
    *   Shelter information and capacity status.
    *   Lost and found records.
    *   System data and audit logs.

*   **Media Storage:**
    Dedicated storage (Local file system or Cloud Object Storage like AWS S3) is used for handling uploaded content such as:
    *   Disaster scene images.
    *   Lost person/item photos.
    *   User profile pictures.
    This ensures efficient retrieval and separates heavy media content from the application database.

*   **Admin Panel:**
    Integrated within the application (Role-Based Access) or potentially as a separate web interface, allowing administrators to:
    *   Verify and approve disaster reports.
    *   Manage and update shelter details.
    *   Oversee user activities and content moderation.
    *   Broadcast emergency alerts.

## 3. Deployment Process
The deployment process of Disaster Connect follows a structured CI/CD pipeline approach:

1.  **Build Preparation:**
    *   The frontend (React Native) assets are bundled, and the backend (Node.js) code is optimized.
    *   Environment variables (API keys, DB URIs) are secured.
2.  **Server Configuration:**
    *   The backend server is provisioned with the Node.js runtime and PM2 (Process Manager) for stability.
    *   Firewall rules and CORS policies are configured to secure API access.
3.  **Database Deployment:**
    *   The MongoDB instance is secured, and indexes (especially 2dsphere for geospatial queries) are created to optimize performance.
4.  **Application Deployment:**
    *   Backend services are deployed and started.
    *   The Mobile App binary (.apk) is generated via EAS Build or Android Studio and distributed to users or the Play Store.
5.  **Testing in Live Environment:**
    *   **Smoke Testing:** Verifying server reachability and database connectivity.
    *   **Sanity Testing:** Ensuring critical flows like "Report Disaster" and "Find Shelter" function correctly in the production environment.
6.  **Monitoring & Maintenance:**
    *   Real-time monitoring using tools like server logs and crash analytics/reporting to detect and resolve issues proactively.

## 4. User Feedback Collection
User feedback is essential for the iterative improvement of the Disaster Connect platform. Feedback is collected via:
*   **In-App Reporting:** dedicated features for users to report bugs or suggest improvements.
*   **Shelter Reviews:** Users can provide feedback on shelter facilities and conditions.
*   **Community Forums/Chat:** Direct interaction between volunteers and victims providing qualitative insights.
*   **App Store Reviews:** Public ratings and comments from the user base.

## 5. User Feedback Analysis
Analysis of initial user feedback highlighted the following:
*   **Critical Utility:** Users found the **Real-time Shelter Locator** to be the most valuable feature during simulated drills.
*   **Ease of Use:** The simplified "One-Tap Report" interface was praised for its speed and usability under stress.
*   **Performance:** Volunteers appreciated the quick updates on "Lost & Found" items.
*   **Suggestions:** Some users requested **Offline Mode** capabilities to access cached map data when network connectivity is lost during disasters. This is a key area for future development.

---

# References

1.  Tanenbaum, A. S., & Wetherall, D. J. (2011). *Computer Networks* (5th ed.). Pearson.
2.  Meier, R. (2012). *Professional Android 4 Application Development*. Wrox.
3.  Banker, K. (2011). *MongoDB in Action*. Manning Publications.
4.  Cantelon, M., et al. (2014). *Node.js in Action*. Manning Publications.
5.  React Native Documentation. (2023). *Fast, resilient, native apps*. Meta Open Source.
6.  Expo Documentation. (2023). *Universal React applications*. generic.
7.  Goodchild, M. F., & Glennon, J. A. (2010). Crowdsourcing geographic information for disaster response: a research frontier. *International Journal of Digital Earth*, 3(3), 231-241.
8.  Roche, S., Propeck-Zimmermann, E., & Mericskay, B. (2013). Geo-web functions involved in the VGI process for civil security/protection: The case of the 2010 Haiti earthquake. *Cartography and Geographic Information Science*.
9.  Zook, M., et al. (2010). Volunteered geographic information and crowdsourcing disaster relief: a case study of the Haitian earthquake. *World Medical & Health Policy*.
10. MongoDB Inc. (2023). *Geospatial Queries with MongoDB*. MongoDB Manual.
11. Amazon Web Services (AWS). (2023). *Disaster Response and Cloud resiliency*. AWS Whitepapers.
12. Google Maps Platform. (2023). *Geolocation API and Maps SDK for Android*. Google Cloud.
13. Express.js. (2023). *Fast, unopinionated, minimalist web framework for Node.js*. OpenJS Foundation.
14. Sommerville, I. (2015). *Software Engineering* (10th ed.). Pearson.
15. Pressman, R. S. (2014). *Software Engineering: A Practitioner's Approach* (8th ed.). McGraw-Hill.
16. ISO/IEC 25010. (2011). *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE)*.
17. FEMA. (2022). *Guidance on Alert and Warning Systems*. Federal Emergency Management Agency.
18. Nelson, F. (2020). *Usability Engineering for Mobile Applications*. Morgan Kaufmann.
19. OWASP. (2023). *Mobile Application Security Verification Standard (MASVS)*. Open Web Application Security Project.
20. United Nations Office for the Coordination of Humanitarian Affairs (OCHA). (2021). *Data Responsibility Guidelines*.
