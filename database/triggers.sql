CREATE OR REPLACE FUNCTION reduce_stock()

RETURNS TRIGGER

AS $$

BEGIN

UPDATE stock

SET remaining_quantity=remaining_quantity-NEW.quantity

WHERE id=NEW.stock_id;

RETURN NEW;

END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reduce_stock

AFTER INSERT

ON sale_items

FOR EACH ROW

EXECUTE FUNCTION reduce_stock();

CREATE OR REPLACE FUNCTION check_expiry()

RETURNS TABLE(

medicine VARCHAR,

expiry DATE

)

AS $$

BEGIN

RETURN QUERY

SELECT

m.medicine_name,

s.expiry_date

FROM medicines m

JOIN stock s

ON m.id=s.medicine_id

WHERE s.expiry_date<=CURRENT_DATE+30;

END;

$$ LANGUAGE plpgsql;