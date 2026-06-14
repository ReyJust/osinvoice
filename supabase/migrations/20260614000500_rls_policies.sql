create policy "Enable users to CRUD their own data only"
  on "public"."clients"
  as permissive
  for all
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Enable users to CRUD their own data only"
  on "public"."companies"
  as permissive
  for all
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Enable users to CRUD their own data only"
  on "public"."invoices"
  as permissive
  for all
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "owner"
  on "public"."user_settings"
  as permissive
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
