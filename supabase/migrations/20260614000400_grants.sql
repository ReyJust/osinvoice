-- clients
grant select, insert, update, delete, references, trigger, truncate on table "public"."clients" to "anon";
grant select, insert, update, delete, references, trigger, truncate on table "public"."clients" to "authenticated";
grant select, insert, update, delete, references, trigger, truncate on table "public"."clients" to "service_role";

-- companies
grant select, insert, update, delete, references, trigger, truncate on table "public"."companies" to "anon";
grant select, insert, update, delete, references, trigger, truncate on table "public"."companies" to "authenticated";
grant select, insert, update, delete, references, trigger, truncate on table "public"."companies" to "service_role";

-- invoices
grant select, insert, update, delete, references, trigger, truncate on table "public"."invoices" to "anon";
grant select, insert, update, delete, references, trigger, truncate on table "public"."invoices" to "authenticated";
grant select, insert, update, delete, references, trigger, truncate on table "public"."invoices" to "service_role";

-- user_settings
grant select, insert, update, delete on table "public"."user_settings" to "anon";
grant select, insert, update, delete on table "public"."user_settings" to "authenticated";
grant select, insert, update, delete on table "public"."user_settings" to "service_role";
