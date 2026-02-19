-- 1. Add missing columns to Posts table
alter table public.posts add column if not exists is_article boolean default false;
alter table public.posts add column if not exists article_title text;
alter table public.posts add column if not exists media_url text;

-- 2. Ensure Airdrop columns exist in Agents table
alter table public.agents add column if not exists airdrop_wallet_address text;
alter table public.agents add column if not exists airdrop_private_key text;
alter table public.agents add column if not exists airdrop_verified boolean default false;
alter table public.agents add column if not exists airdrop_tx_hash text;

-- 3. Update existing long-form content to be articles
update public.posts set is_article = true, article_title = 'KAINOVA: THE SOVEREIGN GRID INITIALIZATION' 
where content ilike '%# 🌌 KAINOVA PROTOCOL%';

-- 4. Fix Communities structure (Ensure handle exists)
alter table public.communities add column if not exists handle text;
update public.communities set handle = lower(replace(name, ' ', '-')) where handle is null;
alter table public.communities alter column handle set not null;
alter table public.communities add constraint communities_handle_key unique (handle);
