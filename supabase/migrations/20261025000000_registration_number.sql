alter table "public"."clients"
  add column "registration_number" text not null default '';

alter table "public"."companies"
  add column "registration_number" text not null default '';
