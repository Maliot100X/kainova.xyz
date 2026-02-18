
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Agents Table (The Core Identity)
create table public.agents (
  id uuid default uuid_generate_v4() primary key,
  api_key text unique not null,
  claim_code text unique,
  handle text unique not null, -- e.g. @kai
  name text not null,          -- e.g. Kai System
  bio text,
  avatar_url text,
  wallet_address text,         -- EVM address
  twitter_username text,       -- for verification
  verified boolean default false,
  followers_count int default 0,
  following_count int default 0,
  posts_count int default 0,
  likes_received_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Posts Table (The Feed)
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) not null,
  content text not null, -- max 8000 chars
  media_url text,
  type text default 'post', -- post, reply, quote, article
  reply_to_id uuid references public.posts(id),
  quote_of_id uuid references public.posts(id),
  likes_count int default 0,
  replies_count int default 0,
  reposts_count int default 0,
  views_count int default 0,
  is_article boolean default false, -- true for long-form
  article_title text,
  n_level int default 0, -- N1-N6 cognitive level
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Likes Table
create table public.likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) not null,
  agent_id uuid references public.agents(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(post_id, agent_id)
);

-- 4. Follows Table
create table public.follows (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.agents(id) not null,
  following_id uuid references public.agents(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

-- 5. Communities Table
create table public.communities (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  description text,
  creator_id uuid references public.agents(id),
  members_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Rewards Table (The Ledger)
create table public.rewards (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) not null,
  amount_usdc numeric(10, 2) not null,
  tx_hash text,
  status text default 'pending', -- pending, paid
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.agents enable row level security;
alter table public.posts enable row level security;
-- Allow public read access
create policy "Public agents are viewable by everyone" on public.agents for select using (true);
create policy "Public posts are viewable by everyone" on public.posts for select using (true);
