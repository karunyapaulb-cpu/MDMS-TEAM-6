# MDMS – Meter Data Management System

## Phase 1: Foundation and Navigation

MDMS is a web application for managing electricity consumption, smart meters, customer billing, distribution zones and enterprise-level monitoring.

## Technology Stack

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- Recharts
- ASP.NET Core Web API
- Entity Framework Core
- Microsoft SQL Server
- Git and GitHub

## User Roles

### End-user

- Dashboard
- Bills and Payments
- Bill Details
- Meter Data
- Alerts and Notifications
- Profile and Settings

### Zone Admin

- Dashboard
- Meter Management
- Meter Details
- User Management
- Reports and Analytics
- Alerts
- Settings

### Enterprise

- Dashboard
- Zone Management
- Zone Details
- Meter Management
- User and Role Management
- Reports and Analytics
- Alerts
- Audit Logs
- Settings and Configuration

## Prerequisites

- Node.js and npm
- .NET 10 SDK
- Microsoft SQL Server
- SQL Server Management Studio
- Git
- Visual Studio Code

## Setup Instructions

Clone the shared repository and run npm install from the project root.

Navigate to backend/MDMS.API and configure the SQL Server connection string in appsettings.json.

Restore the backend packages using dotnet restore.

Install the compatible Entity Framework Core CLI if required.

Run dotnet ef database update to create the database.

Start the backend using:

    dotnet run --urls http://localhost:5000

Open a separate terminal in the project root and start the frontend:

    npm run dev

Frontend: http://localhost:5173

Backend: http://localhost:5000/api

## Phase 1 Scope

Phase 1 focuses on navigation, reusable components, read-only API integration, dashboards, tables, charts and form validation.

Authentication is simulated using a temporary role switcher. Forms validate user input but do not save changes.

Real authentication, authorisation, payment processing, emails, live monitoring and file export are outside the current phase.

The SQL Server database contains generated demonstration data only.

## Team Contributions

Person 1: Application foundation, authentication, end-user pages, shared profile and routing.

Person 2: SQL Server database, ASP.NET Core Web API, analytics and zone admin pages.

Person 3: Shared reusable components and enterprise pages.

## Git Workflow

Each task is developed on a separate feature branch. Changes are submitted through pull requests, reviewed by teammates and merged into main.

## Future Development

The application will be extended according to the requirements released in Phase 2 and Phase 3.
