drop view invoice_search;

create view public.invoice_search
with (security_invoker = true) as
select
  invoices.*,

  jsonb_build_object(
    'id', companies.id,
    'name', companies.name
  ) as company,

  jsonb_build_object(
    'id', clients.id,
    'name', clients.name
  ) as client,

  companies.name as company_name,
  clients.name as client_name
from invoices
inner join companies on companies.id = invoices.company_id
inner join clients on clients.id = invoices.client_id;