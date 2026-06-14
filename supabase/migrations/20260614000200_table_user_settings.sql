create table "public"."user_settings" (
  "id"                  serial primary key,
  "user_id"             uuid not null unique references auth.users(id),
  "email_body_template" text,
  "created_at"          timestamptz default now(),
  "updated_at"          timestamptz default now()
);

alter table "public"."user_settings" enable row level security;
