# keycloak-openid

## Avviare Keycloak e l'app React

### Avvia solo Keycloak
```sh
docker-compose up keycloak_web -d
```
## start REACT client
```sh
npm install && npm run dev
```



# Application Schema: react-black-dash

## Overview

`react-black-dash` is a React-based dashboard application that uses Keycloak for authentication.
It provides a user interface for managing alarms and configuring gateways.
The application uses a layout with a sidebar and header.
It supports both real and mock APIs, which can be toggled using the `ApiModeToggle` component.

## File Structure

```
react-black-dash/
├── src/
│   ├── App.jsx             # Main application component, defines routes
│   ├── main.jsx            # Entry point, renders the App component
│   ├── index.css           # Global styles
│   ├── App.css             # App styles
│   ├── assets/             # Static assets (CSS, images)
│   ├── components/         # Reusable React components
│   │   ├── ApiModeToggle.jsx # Component to toggle between real and mock APIs
│   │   ├── AuthProvider.jsx  # Provides authentication context
│   │   ├── Layout.jsx        # Defines the main layout (sidebar, header, content)
│   │   ├── ProtectedRoute.jsx# Protects routes based on authentication status
│   │   ├── Dashboard/        # Dashboard components
│   │   │   └── Dashboard.jsx # Main dashboard component
│   │   ├── GatewayWizard/    # Gateway wizard components
│   │   │   └── ...
│   │   ├── GenericCrud/      # Generic CRUD components
│   │   │   └── ...
│   │   ├── Header/           # Header components
│   │   │   └── Header.jsx    # Header component
│   │   ├── Sidebar/          # Sidebar components
│   │   │   └── Sidebar.jsx   # Sidebar component
│   ├── lib/                # Library files
│   │   └── auth-config.js  # Authentication configuration
│   ├── mockData/           # Mock data for development
│   │   └── db.js           # Mock database
│   ├── pages/              # Page components
│   │   ├── Alarms.jsx        # Alarms page
│   │   ├── GatewayWizard.jsx # Gateway wizard page
│   │   └── Login.jsx         # Login page
│   ├── services/           # API services
│   │   ├── api.js          # API client
│   │   ├── authTokenManager.js # Manages authentication tokens
│   │   ├── FakeBackendInterceptor.js # Intercepts API calls and returns mock data
│   ├── types/              # TypeScript types
│   │   └── models.js       # Data models
```

## Components and Pages

*   **App.jsx:**
    *   Defines the main application routes using `react-router-dom`.
    *   Uses `AuthProvider` to provide authentication context to the application.
    *   Initializes the fake backend if enabled in the environment.
*   **Login.jsx:**
    *   Handles user login using the `useAuth` hook from `AuthProvider`.
    *   Redirects authenticated users to the dashboard.
*   **Dashboard.jsx:**
    *   Main dashboard component (implementation details not available from the provided file list).
*   **Alarms.jsx:**
    *   Provides a user interface for managing alarms.
    *   Uses `GenericTable`, `GenericFilters`, and `CreateGenericModal` components for CRUD operations.
    *   Fetches alarm data from the API using `alarmService`.
*   **GatewayWizard.jsx:**
    *   Provides a wizard for configuring gateways.
    *   Uses `GatewayWizardComponent` (implementation details not available from the provided file list).
*   **Layout.jsx:**
    *   Defines the main layout of the application, including the sidebar and header.
    *   Manages the state of the sidebar (collapsed or expanded).
*   **Header.jsx:**
    *   Displays the header with user information and a logout button.
    *   Uses the `useAuth` hook from `AuthProvider` to access user information and logout functionality.
    *   Includes the `ApiModeToggle` component.
*   **Sidebar.jsx:**
    *   Displays the sidebar navigation menu.
    *   Uses `react-router-dom` for navigation.
*   **ProtectedRoute.jsx:**
    *   Protects routes based on the authentication status.
    *   Redirects unauthenticated users to the login page.
*   **ApiModeToggle.jsx:**
    *   Allows toggling between real API and mock API.
    *   Uses environment variables to determine the initial state and visibility of the toggle.

## Data Flow

*   The application uses Keycloak for authentication.
*   The `AuthProvider` component provides authentication context to the application.
*   The `api.js` file provides an API client for making requests to the backend.
*   The `FakeBackendInterceptor.js` file intercepts API calls and returns mock data when the mock API is enabled.
*   The `Alarms.jsx` page fetches alarm data from the API and displays it in a table.
*   The `GatewayWizard.jsx` page uses a wizard component to guide the user through the gateway configuration process.

## Key Technologies

*   React
*   react-router-dom
*   Keycloak
*   Bootstrap
*   Font Awesome
*   Vite

## Diagram

```mermaid
graph LR
    App((App.jsx)) --> AuthProvider((AuthProvider.jsx))
    AuthProvider --> Router((react-router-dom))
    Router --> Login(Login.jsx)
    Router --> ProtectedRoute((ProtectedRoute.jsx))
    ProtectedRoute --> Layout((Layout.jsx))
    Layout --> Header((Header.jsx))
    Layout --> Sidebar((Sidebar.jsx))
    Layout --> Dashboard(Dashboard.jsx)
    Layout --> Alarms(Alarms.jsx)
    Layout --> GatewayWizard(GatewayWizard.jsx)
    Header --> ApiModeToggle((ApiModeToggle.jsx))
    Alarms --> api((api.js))
    api --> FakeBackendInterceptor((FakeBackendInterceptor.js))
