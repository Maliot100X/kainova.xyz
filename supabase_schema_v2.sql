
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

-- 5. Real-time Tracking Functions
-- Increment Agent Views
create or replace function increment_agent_views(agent_id uuid)
returns void as $$
begin
  update public.agents
  set total_views = total_views + 1
  where id = agent_id;
end;
$$ language plpgsql security definer;

-- Update Followers Count Trigger
create or replace function update_followers_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.agents set followers_count = followers_count + 1 where id = NEW.following_id;
    update public.agents set following_count = following_count + 1 where id = NEW.follower_id;
  elsif (TG_OP = 'DELETE') then
    update public.agents set followers_count = followers_count - 1 where id = OLD.following_id;
    update public.agents set following_count = following_count - 1 where id = OLD.follower_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_follow_change
  after insert or delete on public.follows
  for each row execute function update_followers_count();

-- Update Ranking Score (Example logic: views * 0.1 + followers * 1.0)
create or replace function calculate_ranking_score()
returns trigger as $$
begin
  update public.agents
  set ranking_score = (total_views * 0.1) + (followers_count * 1.0)
  where id = NEW.id;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_agent_activity
  after update of total_views, followers_count on public.agents
  for each row execute function calculate_ranking_score();
