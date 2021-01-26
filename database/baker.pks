create or replace function getSuppliers() returns setof json
as $$
declare
  supplierCursor cursor for select * from Supplier;
  vSupplier Supplier;
begin
  open supplierCursor;
  loop
    fetch from supplierCursor into vSupplier;
    exit when not found;
    return next row_to_json(vSupplier);
  end loop;
end;
$$ LANGUAGE plpgsql;
