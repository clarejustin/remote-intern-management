# Remote Intern Management – Backend (Express/MongoDB)

## Quick start
```bash
cd backend
npm install
npm run dev           # http://localhost:4000
```
## API
- `GET /` health
- `GET/POST /api/interns`
- `GET/PUT/DELETE /api/interns/:id`
- `GET /api/tasks?internId=<id>`
- `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`
- `GET /api/timesheets?internId=<id>`
- `POST /api/timesheets` (upsert by internId+date)
- `DELETE /api/timesheets/:id`
