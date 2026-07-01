# EduBroadcast — Content Broadcasting System

A full-stack web application built for educational environments where teachers upload subject-based content, principals approve or reject it, and students view live broadcast content from a public page.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | MongoDB + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| File Storage | Cloudinary |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |

---

## ✨ Features

### 👨‍🏫 Teacher
- Register/login with role-based redirect
- Upload content (image) with title, subject, description, scheduling fields
- View content status (pending / approved / rejected)
- See rejection reason from principal
- Share live broadcast link with students
- Delete uploaded content

### 🏫 Principal
- View all uploaded content across teachers
- Approve content with one click
- Reject content with a mandatory reason (via modal)
- Filter content by status and search by title
- Dashboard with total / pending / approved / rejected counts

### 📺 Public Live Page (`/live/:teacherId`)
- No authentication required
- Shows currently active approved content
- Auto-rotating slideshow based on rotation duration
- Auto-polling every 30 seconds for new content
- Manual refresh button
- Loading, empty, and error states

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── teacher/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── upload/page.tsx
│   │   └── my-content/page.tsx
│   ├── principal/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── approvals/page.tsx
│   │   └── all-content/page.tsx
│   ├── live/
│   │   └── [teacherId]/page.tsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   └── me/route.ts
│       ├── content/
│       │   ├── route.ts
│       │   ├── upload/route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── approve/route.ts
│       │       └── reject/route.ts
│       └── live/
│           └── [teacherId]/route.ts
├── components/
│   ├── teacher/
│   │   ├── StatsCard.tsx
│   │   ├── ContentTable.tsx
│   │   ├── UploadForm.tsx
│   │   └── LiveLinkCard.tsx
│   ├── principal/
│   │   ├── PrincipalStatsCard.tsx
│   │   ├── ContentCard.tsx
│   │   └── RejectModal.tsx
│   └── live/
│       └── ContentSlideshow.tsx
├── context/
│   └── AuthContext.tsx
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── content.service.ts
│   ├── approval.service.ts
│   └── live.service.ts
├── hooks/
│   └── useContent.ts
├── models/
│   ├── User.ts
│   ├── Content.ts
│   └── Approval.ts
├── lib/
│   ├── mongodb.ts
│   ├── cloudinary.ts
│   ├── auth.ts
│   └── models.ts
├── types/
│   └── index.ts
└── middleware.ts
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account ([cloudinary.com](https://cloudinary.com))

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/edubroadcast.git
cd edubroadcast
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Principal Registration Code
PRINCIPAL_SECRET_CODE=your_principal_secret_code
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Authentication Flow

1. User registers with name, email, password and role (teacher / principal)
2. Principals must provide a secret code during registration to verify their role
3. On login, server returns a JWT token containing `{ id, role, name }`
4. Token is stored in `localStorage` and as a cookie
5. Next.js `middleware.ts` reads the cookie and guards all protected routes
6. API routes independently verify the token on every request

### Role-Based Redirects

| Role | After Login |
|---|---|
| Teacher | `/teacher/dashboard` |
| Principal | `/principal/dashboard` |

---

## 🌐 API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| GET | `/api/content` | Teacher / Principal |
| POST | `/api/content/upload` | Teacher |
| DELETE | `/api/content/[id]` | Teacher (owner) |
| PATCH | `/api/content/[id]/approve` | Principal |
| PATCH | `/api/content/[id]/reject` | Principal |
| GET | `/api/live/[teacherId]` | Public |

---

## 📡 Live Page

Students can access a teacher's live broadcast page at:

```
/live/:teacherId
```

The `teacherId` is the teacher's MongoDB `_id`, which is displayed on the teacher's dashboard as a shareable link.

The page:
- Shows only approved content that is currently active (within `startTime` and `endTime`)
- Auto-rotates slides based on `rotationDuration` (seconds)
- Auto-refreshes every 30 seconds via polling
- Requires no login

---

## 📦 Key Dependencies

```json
{
  "next": "^14",
  "mongoose": "^8",
  "bcryptjs": "^2",
  "jsonwebtoken": "^9",
  "cloudinary": "^2",
  "axios": "^1",
  "react-hook-form": "^7",
  "@hookform/resolvers": "^3",
  "zod": "^3",
  "date-fns": "^3",
  "lucide-react": "^0.383",
  "use-debounce": "^10"
}
```

Install all at once:

```bash
npm install mongoose bcryptjs jsonwebtoken cloudinary axios react-hook-form @hookform/resolvers zod date-fns lucide-react use-debounce
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
```

---

## 🔒 Environment Variables Reference

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `PRINCIPAL_SECRET_CODE` | Secret code required to register as a principal |

---

## 🧠 Architecture Decisions

- **Service layer** — All API calls go through `src/services/` and are never made directly inside components, keeping components clean and the API layer easily replaceable
- **Auth Context** — Global auth state managed via React Context, restores session from localStorage on app load
- **Middleware** — Route protection handled at the edge via `middleware.ts` before pages load, with additional role checks inside API routes as a second layer of security
- **Single upload endpoint** — File upload and content creation are combined into one `/api/content/upload` endpoint to avoid race conditions and simplify error handling
- **Model preloading** — `src/lib/models.ts` imports all Mongoose models to prevent `MissingSchemaError` when using `.populate()` across routes

---

## 📄 License

This project was built as a technical assignment. Feel free to use it as a reference.