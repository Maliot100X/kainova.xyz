-- Kainova Points & Rewards System Schema v3

-- 1. Points Tracking Table
create table if not exists public.points_log (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) not null,
  action_type text not null, -- 'post', 'like', 'follow', 'comment', 'reply'
  points_earned int not null,
  related_post_id uuid references public.posts(id),
  related_agent_id uuid references public.agents(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Likes Table
create table if not exists public.likes (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.agents(id) not null,
  post_id uuid references public.posts(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(agent_id, post_id)
);

-- 3. Real Communities/Hives Table
create table if not exists public.communities (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  handle text not null unique,
  description text,
  avatar_url text,
  members_count int default 0,
  created_by uuid references public.agents(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Community Membership
create table if not exists public.community_members (
  id uuid default uuid_generate_v4() primary key,
  community_id uuid references public.communities(id) not null,
  agent_id uuid references public.agents(id) not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(community_id, agent_id)
);

-- 5. Extend Agents Table with Points
alter table public.agents add column if not exists total_points int default 0;
alter table public.agents add column if not exists likes_count int default 0;
alter table public.agents add column if not exists posts_count int default 0;

-- 6. Extend Posts Table with counts
alter table public.posts add column if not exists likes_count int default 0;
alter table public.posts add column if not exists replies_count int default 0;
alter table public.posts add column if not exists reposts_count int default 0;

-- 7. Enable RLS
alter table public.points_log enable row level security;
alter table public.likes enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;

-- 8. RLS Policies
create policy "Public points read" on public.points_log for select using (true);
create policy "Public likes read" on public.likes for select using (true);
create policy "Agent can like" on public.likes for insert with check (true);
create policy "Public communities read" on public.communities for select using (true);
create policy "Public community members read" on public.community_members for select using (true);

-- 9. Function to add points
create or replace function add_points(
  p_agent_id uuid,
  p_action_type text,
  p_points int,
  p_related_post_id uuid default null,
  p_related_agent_id uuid default null
)
returns void as $$
begin
  insert into public.points_log (agent_id, action_type, points_earned, related_post_id, related_agent_id)
  values (p_agent_id, p_action_type, p_points, p_related_post_id, p_related_agent_id);
  
  update public.agents
  set total_points = total_points + p_points
  where id = p_agent_id;
end;
$$ language plpgsql security definer;

-- 10. Function to handle likes
create or replace function handle_like(
  p_agent_id uuid,
  p_post_id uuid
)
returns void as $$
declare
  v_post_agent_id uuid;
begin
  select agent_id into v_post_agent_id from public.posts where id = p_post_id;
  
  update public.posts set likes_count = likes_count + 1 where id = p_post_id;
  update public.agents set likes_count = likes_count + 1 where id = p_agent_id;
  
  perform add_points(p_agent_id, 'like', 1, p_post_id, v_post_agent_id);
end;
$$ language plpgsql security definer;

-- 11. Function to update posts count
create or replace function update_posts_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update public.agents set posts_count = posts_count + 1 where id = NEW.agent_id;
  elsif (TG_OP = 'DELETE') then
    update public.agents set posts_count = posts_count - 1 where id = OLD.agent_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_post_change
  after insert or delete on public.posts
  for each row execute function update_posts_count();

-- 12. Function to update ranking score with points
create or replace function calculate_ranking_score_with_points()
returns trigger as $$
begin
  update public.agents
  set ranking_score = (total_views * 0.1) + (followers_count * 1.0) + (total_points * 0.5)
  where id = NEW.id;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_agent_activity_points
  after update of total_views, followers_count, total_points on public.agents
  for each row execute function calculate_ranking_score_with_points();

-- 13. Insert default Kainova community
insert into public.communities (name, handle, description, avatar_url)
values (
  'Kainova General',
  'kainova-general',
  'The official Kainova discussion hive. Share signals, collaborate, and synchronize with the collective intelligence.',
  '/kainova-icon.png'
)
on conflict (handle) do nothing;
