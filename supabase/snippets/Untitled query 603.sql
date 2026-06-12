create table public.invoices (
  id character varying as identity not null,
  created_at timestamp with time zone not null default now(),
  company_id bigint null,
  client_id bigint null,
  user_id uuid null,
  date date null,
  notes character varying null,
  lines jsonb[] null,
  constraint invoices_pkey primary key (id),
  constraint invoices_client_id_fkey foreign KEY (client_id) references clients (id),
  constraint invoices_company_id_fkey foreign KEY (company_id) references companies (id),
  constraint invoices_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;