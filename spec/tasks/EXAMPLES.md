# Example Task Files

These are example task files to demonstrate proper task structure.

## Task 01 — Initialize Project

### Input
- Git repository exists
- Folder structure locked

### Output
- Package.json created
- Dependencies installed
- Dev server runs

### Success Criteria
- `npm run dev` starts without errors
- Browser opens to localhost
- No console errors

---

## Task 02 — Core API Endpoint

### Input
- Backend folder exists
- Node.js installed

### Output
- Express server running on port 3001
- POST /api/submit endpoint
- Returns `{ success: true, id: string }`

### Success Criteria
- Server starts: `npm run server`
- curl test passes:
  ```bash
  curl -X POST http://localhost:3001/api/submit \
    -H "Content-Type: application/json" \
    -d '{"data":"test"}'
  ```
- Response time < 100ms

---

## Task 03 — UI Shell

### Input
- Stitch-generated components in `frontend/src/components/`
- React app initialized

### Output
- App.jsx imports and renders Home component
- Basic routing (Home, Result, Error)
- Navigation works

### Success Criteria
- All routes render without errors
- Navigation between pages works
- No console warnings

---

## Task 04 — Main User Flow

### Input
- UI Shell (Task 03)
- Core API (Task 02)

### Output
- Home page form submits to API
- Result page displays API response
- Error page shows on failure

### Success Criteria
- User can input data
- Submit triggers API call
- Success shows result
- Failure shows error page

---

## Task 05 — Integration Test

### Input
- Main flow (Task 04) complete

### Output
- End-to-end flow works
- Error handling tested
- Edge cases covered

### Success Criteria
- Happy path: input → submit → result (works)
- Error path: invalid input → error page (works)
- Loading states visible
- No crashes

---

## Task 06 — Demo Fallback

### Input
- Integration test (Task 05) complete

### Output
- Hardcoded demo data in `DEMO.md`
- Toggle for demo mode
- Reliable demo flow

### Success Criteria
- Demo mode bypasses API
- Shows realistic data
- Never fails
- Documented in `DEMO.md`

---

**Note:** This is 6 tasks. For a real hackathon, you'd have 8-12 tasks total.
