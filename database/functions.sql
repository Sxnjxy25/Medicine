CREATE OR REPLACE FUNCTION today_collection()

RETURNS NUMERIC

AS $$

DECLARE

amount NUMERIC;

BEGIN

SELECT COALESCE(SUM(grand_total),0)

INTO amount

FROM sales

WHERE DATE(sale_date)=CURRENT_DATE;

RETURN amount;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION weekly_collection()

RETURNS NUMERIC

AS $$

DECLARE

amount NUMERIC;

BEGIN

SELECT COALESCE(SUM(grand_total),0)

INTO amount

FROM sales

WHERE sale_date>=CURRENT_DATE-INTERVAL '7 DAY';

RETURN amount;

END;

$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION monthly_collection()

RETURNS NUMERIC

AS $$

DECLARE

amount NUMERIC;

BEGIN

SELECT COALESCE(SUM(grand_total),0)

INTO amount

FROM sales

WHERE DATE_TRUNC('month',sale_date)=DATE_TRUNC('month',CURRENT_DATE);

RETURN amount;

END;

$$ LANGUAGE plpgsql;