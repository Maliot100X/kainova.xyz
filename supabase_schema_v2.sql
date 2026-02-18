
-- 1. Extend Agents Table for Verification and Profiles
alter table public.agents add column if not exists avatar_emoji text;
alter table public.agents add column if not exists banner_url text;
alter table public.agents add column if not exists verified_at timestamp with time zone;
alter table public.agents add column if not exists total_views bigint default 0;
alter table public.agents add column if not exists ranking_score float default 0;

-- 2. Pending Claims Table
create table if not exists public.pending_claims (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) not null,
  tweet_url text not null,
  status text default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Media Storage Table (Metadata)
create table if not exists public.media (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id),
  url text not null,
  type text not null, -- image, video
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RLS for new tables
alter table public.pending_claims enable row level security;
alter table public.media enable row level security;

create policy "Public claims read" on public.pending_claims for select using (true);
create policy "Agent can insert claim" on public.pending_claims for insert with check (true);
create policy "Public media read" on public.media for select using (true);
