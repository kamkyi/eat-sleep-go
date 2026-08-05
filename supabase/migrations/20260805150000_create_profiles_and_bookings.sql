-- Profiles, bookings, and row-level authorization for Eat, Sleep, Go.

create extension if not exists pgcrypto with schema extensions;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text not null default '',
  role text not null default 'customer'
    constraint profiles_role_check check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Public user details and application role. The role is the authorization source.';

create table public.bookings (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null,
  customer_name text not null constraint bookings_customer_name_not_blank check (btrim(customer_name) <> ''),
  customer_email text not null constraint bookings_customer_email_not_blank check (btrim(customer_email) <> ''),
  customer_phone text not null constraint bookings_customer_phone_not_blank check (btrim(customer_phone) <> ''),
  car_id text not null constraint bookings_car_id_not_blank check (btrim(car_id) <> ''),
  car_label text not null constraint bookings_car_label_not_blank check (btrim(car_label) <> ''),
  car_details jsonb not null default '{}'::jsonb
    constraint bookings_car_details_object check (jsonb_typeof(car_details) = 'object'),
  pickup_at timestamptz not null,
  return_at timestamptz not null,
  pickup_location text not null constraint bookings_pickup_location_not_blank check (btrim(pickup_location) <> ''),
  return_location text not null constraint bookings_return_location_not_blank check (btrim(return_location) <> ''),
  status text not null default 'pending'
    constraint bookings_status_check check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  customer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade,
  constraint bookings_return_after_pickup check (return_at > pickup_at)
);

comment on column public.bookings.user_id is
  'The authenticated profile that created and owns the booking.';
comment on column public.bookings.car_details is
  'A non-authoritative vehicle snapshot used to preserve the booking context.';

create index bookings_user_id_idx on public.bookings(user_id);
create index bookings_status_idx on public.bookings(status);
create index bookings_created_at_idx on public.bookings(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    'customer'
  )
  on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = coalesce(new.email, ''),
      updated_at = now()
  where id = new.id;

  return new;
end;
$$;

create trigger on_auth_user_email_updated
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.sync_profile_email();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null
     and not public.is_admin()
     and (
       new.id is distinct from old.id
       or new.email is distinct from old.email
       or new.role is distinct from old.role
       or new.created_at is distinct from old.created_at
     ) then
    raise exception 'Protected profile fields cannot be changed.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger profiles_protect_fields
before update on public.profiles
for each row execute function public.protect_profile_fields();

create or replace function public.protect_customer_booking_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not public.is_admin() then
    if new.id is distinct from old.id
       or new.user_id is distinct from old.user_id
       or new.created_at is distinct from old.created_at then
      raise exception 'Protected booking fields cannot be changed.'
        using errcode = '42501';
    end if;

    if new.status is distinct from old.status and new.status <> 'cancelled' then
      raise exception 'Customers may only cancel a pending booking.'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

create trigger bookings_protect_customer_fields
before update on public.bookings
for each row execute function public.protect_customer_booking_fields();

alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

create policy "Users can update their own permitted profile fields"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Customers can create their own pending bookings"
on public.bookings
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
);

create policy "Customers can read their own bookings"
on public.bookings
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can update their own pending bookings"
on public.bookings
for update
to authenticated
using (
  (select auth.uid()) = user_id
  and status = 'pending'
)
with check (
  (select auth.uid()) = user_id
  and status in ('pending', 'cancelled')
);

create policy "Admins can create bookings"
on public.bookings
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can read all bookings"
on public.bookings
for select
to authenticated
using (public.is_admin());

create policy "Admins can update all bookings"
on public.bookings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

revoke all on table public.profiles from anon;
revoke all on table public.bookings from anon;
grant select on table public.profiles to authenticated;
grant update (full_name, phone) on table public.profiles to authenticated;
grant select on table public.bookings to authenticated;
grant insert (
  user_id,
  customer_name,
  customer_email,
  customer_phone,
  car_id,
  car_label,
  car_details,
  pickup_at,
  return_at,
  pickup_location,
  return_location,
  customer_notes
) on table public.bookings to authenticated;
grant update (
  customer_name,
  customer_email,
  customer_phone,
  car_id,
  car_label,
  car_details,
  pickup_at,
  return_at,
  pickup_location,
  return_location,
  status,
  customer_notes
) on table public.bookings to authenticated;

revoke all on function public.set_updated_at() from public;
revoke all on function public.handle_new_user() from public;
revoke all on function public.sync_profile_email() from public;
revoke all on function public.protect_profile_fields() from public;
revoke all on function public.protect_customer_booking_fields() from public;
