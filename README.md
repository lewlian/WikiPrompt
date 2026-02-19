# WikiPrompt

**The community-driven marketplace for AI prompts.**

Discover, share, and collect curated prompt packs for ChatGPT, Claude, Gemini, Llama, Mistral, and more. WikiPrompt connects prompt engineers with creators and teams who want ready-to-use, battle-tested prompts.

---

## Features

### Marketplace & Discovery
- **Browse prompt packs** in a responsive card grid with image previews, category tags, and creator info
- **Search** prompts by title in real time
- **Filter** by category (Writing, Programming, Art & Design, Business, Education, Marketing, and more)
- **Filter by AI model** -- GPT-4, GPT-3.5, Claude 2/3, Gemini Pro, Llama 2, Mistral
- **Sort** by newest or most popular

### Prompt Packs
- **Rich detail pages** with multi-image gallery, full prompt text, and one-click copy to clipboard
- **Preview images** (3-9 per pack) showcasing example outputs
- **Metadata** including AI model, category, upload date, and favorite count
- **"More from this creator"** section to explore related packs

### Creator Tools
- **Upload prompt packs** with drag-and-drop image upload (up to 9 images, 5 MB each)
- **Manage your packs** -- edit or delete with confirmation dialog and automatic image cleanup
- **Creator profiles** with display name, username, bio, and avatar

### User Accounts
- **Sign up / sign in** with email and password (Supabase Auth)
- **Editable profiles** -- update your display name, username, bio, and avatar
- **Favorites** -- heart any prompt pack; view all your liked packs from your profile
- **Purchase tracking** -- buy prompt packs and access your purchase history
- **Profile menu** with quick links to upload, profile, settings, and sign out

### Design & UX
- **Dark theme** with gradient backgrounds and glassmorphism effects
- **Animated welcome banner** with rotating slogans and a gallery carousel for new visitors
- **Responsive layout** -- fully usable on mobile, tablet, and desktop
- **Custom typography** using Space Grotesk and Sixtyfour display font

---

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| Frontend     | React 18, TypeScript                              |
| UI Framework | Material UI (MUI) v7                              |
| Routing      | React Router v6                                   |
| Backend      | Supabase (Auth, PostgreSQL, Storage, RLS)         |
| Payments     | Stripe (react-stripe-js)                          |
| File Upload  | react-dropzone                                    |
| Testing      | Jest, React Testing Library                       |
| Build Tool   | Create React App                                  |

---

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- A [Supabase](https://supabase.com) project (for auth, database, and storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/lewlian/WikiPrompt.git
cd WikiPrompt

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the Supabase migrations in order to set up the schema:

```
supabase/migrations/20240320000000_add_constraints.sql
supabase/migrations/20240320000001_add_rls_policies.sql
supabase/migrations/20240321000000_update_categories.sql
supabase/migrations/20240322000000_create_purchases_table.sql
supabase/migrations/20240322000001_update_prompt_packs_creator.sql
```

### Running the App

```bash
# Development server
npm start
# Open http://localhost:3000

# Run tests
npm test

# Production build
npm run build
```

---

## Project Structure

```
src/
  components/       # Reusable UI components
    Header.tsx          # Top navigation bar with auth controls
    Footer.tsx          # Site footer with links and social icons
    Sidebar.tsx         # Filter panel (AI model, sort order)
    PromptCard.tsx      # Prompt pack card with image grid and favorites
    PromptGrid.tsx      # Responsive grid of prompt cards with filtering
    PromptPackManager.tsx  # Edit/delete controls for pack creators
    ProfileMenu.tsx     # User dropdown menu
    WelcomeBanner.tsx   # Hero carousel for unauthenticated visitors
  contexts/
    AuthContext.tsx     # Authentication state (sign in, sign up, sign out)
  hooks/
    useUserProfile.ts   # Fetch and refresh user profile data
  layouts/
    MainLayout.tsx      # App shell with header and footer
    DashboardLayout.tsx # Home page layout with sidebar and grid
  pages/
    Dashboard.tsx       # Home / marketplace view
    Profile.tsx         # User profile with "My Packs" and "Liked" tabs
    auth/AuthPage.tsx   # Sign in / sign up form
    prompt/[id].tsx     # Prompt pack detail page
    upload/UploadPage.tsx # Create a new prompt pack
  types/
    database.types.ts   # Supabase database types
    supabase.ts         # Domain type definitions
  lib/
    supabaseClient.ts   # Supabase client instance
  theme.ts              # MUI dark theme configuration
supabase/
  migrations/           # SQL migrations for schema and RLS policies
```

---

## License

This project is open source. See the repository for license details.
