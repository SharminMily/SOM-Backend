# SOM Backend — Smart Office Management System

REST API backend for SOM, an office management platform covering auth, users, attendance, leave,projects, tasks, announcements, and notifications.

## Tech Stack
- Node.js, Express.js
- PostgreSQL , Prisma
- JWT (Access + Refresh Token)

## Project Structure
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/  users/  departments/  attendance/
│   │   ├── leave/  projects/  tasks/
│   │   └── announcements/  notifications/
│   ├── middlewares/
│   ├── config/
│   └── app.js
└── package.json
```

## Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
```env
```

## API Modules
| Module | Base Route |
|---|---|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Departments | `/api/departments` |
| Attendance | `/api/attendance` |
| Leave | `/api/leave` |
| Payroll | `/api/payroll` |
| Projects | `/api/projects` |
| Tasks | `/api/tasks` |
| Announcements | `/api/announcements` |
| Notifications | `/api/notifications` |

Full request/response details are in `SOM-API-Postman-Collection.json`.

## User Roles
- **Admin** — full access, user management
- **Manager** — leave approval, attendance override, team management
- **Employee** — attendance, leave apply, own tasks/payslips

## Key Implementation Notes
- JWT middleware on all routes except signup/login
- RBAC enforced on admin/manager-only routes
- Validate all POST/PATCH bodies
- Check project membership before creating tasks

## Testing
Import `SOM-API-Postman-Collection.json` into Postman. Running `Login` auto-saves `accessToken`.