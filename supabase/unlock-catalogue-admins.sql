-- If you previously locked catalogue writes to one owner email, run this
-- so anyone who signs up can save. Leave catalogue_admins empty going forward.

delete from public.catalogue_admins;
