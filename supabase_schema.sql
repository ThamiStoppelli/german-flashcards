-- Supabase starter schema for Wortschatz AI
-- Run this in the Supabase SQL editor after enabling Auth.

create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language text not null default 'de',
  german text not null,
  translation text not null,
  article text,
  plural text,
  example text,
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  tags text[] not null default '{}',
  status text not null default 'active' check (status in ('active','learned','future')),
  ease numeric not null default 2.5,
  repetitions int not null default 0,
  next_review_at timestamptz not null default now(),
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.flashcards enable row level security;

create policy "Users can read own flashcards"
on public.flashcards for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own flashcards"
on public.flashcards for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own flashcards"
on public.flashcards for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own flashcards"
on public.flashcards for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists flashcards_user_status_idx on public.flashcards(user_id, status);
create index if not exists flashcards_user_next_review_idx on public.flashcards(user_id, next_review_at);
