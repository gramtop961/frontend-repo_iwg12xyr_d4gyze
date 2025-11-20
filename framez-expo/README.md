# Framez (React Native + Expo)

A mobile social app for sharing posts with authentication, real-time feed, and user profiles.

## Tech Stack
- Expo (React Native)
- Supabase (Auth, Postgres, Storage, Realtime)

## Features
- Sign up, log in, and log out
- Persistent sessions
- Create posts with text and optional image upload
- Realtime feed (most recent first)
- Profile screen with user info and the user's posts

## Setup
1. Install dependencies:
   ```bash
   npm install -g expo-cli
   cd framez-expo
   npm install
   ```

2. Create a Supabase project and grab:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

3. Create a `.env` file in `framez-expo/`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Database schema (SQL) in Supabase:
   ```sql
   -- Enable realtime on the schema
   alter publication supabase_realtime add table public.posts;

   -- Profiles (optional if using built-in auth user metadata)
   create table if not exists profiles (
     id uuid primary key references auth.users(id) on delete cascade,
     full_name text,
     avatar_url text,
     created_at timestamp with time zone default now()
   );

   -- Posts
   create table if not exists posts (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade not null,
     content text,
     image_url text,
     created_at timestamp with time zone default now()
   );

   create index if not exists posts_created_at_idx on posts(created_at desc);

   -- Row Level Security
   alter table profiles enable row level security;
   alter table posts enable row level security;

   create policy "Public read posts" on posts for select using (true);
   create policy "Users insert own posts" on posts for insert with check (auth.uid() = user_id);
   create policy "Users read own profiles" on profiles for select using (true);
   create policy "Users update own profile" on profiles for update using (auth.uid() = id);
   create policy "Users upsert own profile" on profiles for insert with check (auth.uid() = id);
   ```

5. Run the app:
   ```bash
   npm run start
   ```
   - Open with Expo Go on your device or run on emulators.

## Folder Structure
```
framez-expo/
  app.json
  package.json
  README.md
  app/
    _layout.tsx
    index.tsx          # Feed
    create.tsx         # Create Post
    profile.tsx        # Profile
  lib/
    supabase.ts
  components/
    PostItem.tsx
    AuthGate.tsx
  assets/
    icon.png
    splash.png
    adaptive-icon.png
```

## Deployment to Appetize.io
1. Build Android debug APK:
   ```bash
   npx expo run:android --device --variant debug
   ```
   Upload the generated APK from `android/app/build/outputs/apk/debug/` to Appetize.

2. Or use EAS Build for cloud builds.

## Demo Video
Record a 2–3 minute walkthrough of sign up, feed, create post, and profile.
