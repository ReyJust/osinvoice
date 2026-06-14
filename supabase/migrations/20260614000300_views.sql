create or replace view "public"."invoice_search" as
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
    jsonb_build_object('id', companies.id, 'name', companies.name) as company,
    jsonb_build_object('id', clients.id,   'name', clients.name)   as client,
    companies.name as company_name,
    clients.name   as client_name
  from public.invoices
  left join public.companies on companies.id = invoices.company_id
  left join public.clients   on clients.id   = invoices.client_id;
