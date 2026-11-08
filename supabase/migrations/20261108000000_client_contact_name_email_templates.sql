-- Contact person for a client (used to greet them by name in emails)
alter table "public"."clients"
  add column "contact_name" text not null default '';

-- Second email template, used when the client has a contact name.
-- The existing "email_body_template" remains the template without contact name.
alter table "public"."user_settings"
  add column "email_body_template_contact" text;

-- Expose full client/company rows (email, contact name, bank details) to the
-- invoice list, and enforce RLS of the underlying tables on the view.
create or replace view "public"."invoice_search"
  with (security_invoker = true) as
  select
    invoices.id,
    invoices.lines,
    invoices.company_id,
    invoices.client_id,
    invoices.user_id,
    invoices.notes,
    invoices.date,
    invoices.created_at,
    invoices.deleted,
    invoices.status,
    to_jsonb(companies.*) as company,
    to_jsonb(clients.*)   as client,
    companies.name as company_name,
    clients.name   as client_name
  from public.invoices
  left join public.companies on companies.id = invoices.company_id
  left join public.clients   on clients.id   = invoices.client_id;
