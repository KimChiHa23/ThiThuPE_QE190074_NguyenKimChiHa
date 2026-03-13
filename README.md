Create a frontend web application for managing a personal list of study resources.

Requirements:

1. Technology
- Use React or Next.js
- Use Tailwind CSS
- Use Shadcn UI components
- Use Supabase for backend services (Supabase Auth and Supabase Database API)
- Use Supabase Storage for image upload

2. Public Home Page
Create a public page that displays a list of all study resources added by all users.

Each resource must display:
- Title (required)
- Link/URL (required)
- Category (optional, e.g., Next.js, AI, UI/UX)
- Image thumbnail (uploaded by users)

Use Shadcn UI components such as Cards and Badges to display each resource.

3. Authentication (Supabase Auth)
Implement authentication using Supabase Auth.

Features:
- User registration with email and password
- User login with email and password
- Logout button in the navigation/header
- Protected routes so only authenticated users can access the dashboard

Unauthenticated users trying to access protected pages should be redirected to the login page.

4. Resource Management (CRUD using Supabase API)

Authenticated users can manage their own resources.

Create Resource:
- Users can add a resource with:
  - Title
  - Link
  - Category
  - Uploaded Image

Edit Resource:
- Users can edit their own resource (title, link, category, image).
- After saving, redirect back to the resource list.

Delete Resource:
- Users can delete their own resource.
- Show a confirmation dialog before deleting (use Shadcn AlertDialog).

5. Database Structure

Create a table called "resources" with fields:
- id
- title
- link
- category
- image_url
- user_id
- created_at

Each resource must belong to the user who created it.

6. UI Pages

The app should include these pages:

- Home page (public resource list)
- Register page
- Login page
- Dashboard page (user's resources)
- Add Resource page
- Edit Resource page

7. Image Upload

Implement image upload using Supabase Storage and display the uploaded image as a thumbnail for each resource.

8. Deployment

The project should:
- Be pushed to a public GitHub repository
- Be deployed online (Vercel or Netlify)

Generate a clean project structure and example code for all main features.