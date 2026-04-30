# Grameen Connect

**Connecting Rural Labour to Contractors — Fast, Free, Verified**

A full-stack web application that connects skilled labourers (masons, electricians, plumbers, carpenters, painters, welders, farm workers) with construction contractors across India.

## Features

### For Labourers
- Create a verified profile with skills, experience, and daily rate
- Browse and search available jobs
- Apply to jobs with cover messages
- Track application status (pending/accepted/rejected)
- Chat with contractors in real-time
- Receive and display reviews from completed jobs

### For Contractors
- Post job listings with detailed requirements
- Browse verified worker profiles
- Review and manage applications
- Accept/reject worker applications
- Chat with labourers
- Leave reviews after job completion

### Platform Features
- Phone/Aadhaar verification for trust
- Real-time messaging with Socket.io
- Multi-language support (Hindi, Bengali, Bhojpuri, English)
- Hyperlocal search by state and district
- Dark theme UI with green accent colors
- Fully responsive design (mobile-first)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Authentication | JWT + bcrypt |
| File Upload | Multer + Cloudinary |
| Routing | React Router v6 |

## Project Structure

```
grameen-connect/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── socket/          # Socket.io handlers
│   ├── seed/            # Development seed data
│   ├── utils/           # Helper functions
│   ├── .env             # Environment variables
│   ├── server.js        # Express server entry
│   └── package.json
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── ui/          # Reusable UI components
        │   ├── layout/      # TopNav, Footer
        │   └── shared/      # Avatar, StarRating
        ├── context/         # Auth, Socket providers
        ├── hooks/           # Custom hooks
        ├── pages/           # Page components
        ├── services/        # API client
        ├── App.jsx          # Main app component
        ├── main.jsx         # Entry point
        └── index.css        # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn package manager

### 1. Clone and Setup

```bash
cd grameen-connect
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
# Update MONGODB_URI with your connection string

# Seed the database with test data
npm run seed

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file (copy from .env.example)

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Test Credentials

After running the seed script, use these credentials:

**Labour Account:**
- Email: `ramesh@gc.com`
- Password: `test123`

**Contractor Account:**
- Email: `anil@gc.com`
- Password: `test123`

### 5. OTP Verification (Development)

During development, OTP codes are logged to the console. When you request an OTP:
- Check the backend terminal for the OTP
- Or use `123456` as the demo OTP

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/send-otp` | Send phone OTP |
| POST | `/api/auth/verify-otp` | Verify phone OTP |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/workers` | List all labourers (with filters) |
| GET | `/api/users/:id` | Get user profile |
| GET | `/api/users/me` | Get own profile |
| PUT | `/api/users/me` | Update own profile |
| DELETE | `/api/users/me` | Delete account |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all active jobs |
| GET | `/api/jobs/:id` | Get job details |
| POST | `/api/jobs` | Create job (contractor) |
| PUT | `/api/jobs/:id` | Update job |
| PATCH | `/api/jobs/:id/status` | Update job status |
| DELETE | `/api/jobs/:id` | Delete job |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply to job |
| GET | `/api/applications/my` | Get my applications |
| GET | `/api/applications/incoming` | Get applications (contractor) |
| PATCH | `/api/applications/:id` | Update application status |
| DELETE | `/api/applications/:id` | Delete application |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | Get all conversations |
| GET | `/api/messages/:userId` | Get messages with user |
| POST | `/api/messages` | Send message |
| PATCH | `/api/messages/:userId/read` | Mark as read |

## Pages

### Public Pages
1. Home/Landing Page
2. Login
3. Sign Up
4. Browse Workers
5. Browse Jobs
6. Job Detail
7. Worker Profile

### Protected Pages
1. Dashboard
2. Post a Job (contractor only)
3. My Applications
4. Messages/Chat
5. Notifications
6. My Profile
7. Settings

## Design System

### Colors
```css
Background:    #0A0F14 (deep dark)
Surface:       #111820
Surface2:      #161E28
Border:        #1E2D3D
Primary:       #22C55E (green)
Accent:        #F59E0B (amber)
Danger:        #EF4444 (red)
Text:          #F0F6FF
Text Muted:    #94A3B8
```

### Typography
- Headings: Sora (Google Font)
- Body: Noto Sans (Google Font)

## Deployment

### Backend (Render/Railway)
1. Create a new Web Service
2. Connect your GitHub repository
3. Set environment variables
4. Add MongoDB connection string
5. Deploy

### Frontend (Vercel)
1. Import project to Vercel
2. Set `VITE_API_URL` to your backend URL
3. Deploy

## Future Enhancements

- [ ] Aadhaar OTP integration via UIDAI API
- [ ] SMS integration via Twilio/MSG91
- [ ] Email notifications via SendGrid
- [ ] Profile photo upload to Cloudinary
- [ ] Advanced search with filters
- [ ] Job recommendations algorithm
- [ ] Worker availability calendar
- [ ] Payment integration for advance payments
- [ ] Multi-language UI translations
- [ ] PWA support for offline access

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please create an issue on GitHub or contact support@grameenconnect.in

---

Built with ❤️ for connecting rural India to opportunities
