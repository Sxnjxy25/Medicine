CREATE VIEW dashboard_summary AS

SELECT

(SELECT COUNT(*) FROM medicines) AS total_medicines,

(SELECT SUM(remaining_quantity) FROM stock) AS total_stock,

(SELECT COUNT(*) FROM stock WHERE expiry_date<CURRENT_DATE) AS expired,

(SELECT SUM(grand_total)
 FROM sales
 WHERE DATE(sale_date)=CURRENT_DATE) AS today_sales;

 CREATE VIEW daily_sales AS

SELECT

DATE(sale_date) AS sales_date,

COUNT(*) AS total_bills,

SUM(grand_total) AS total_amount

FROM sales

GROUP BY DATE(sale_date)

ORDER BY sales_date DESC;

CREATE VIEW monthly_sales AS

SELECT

DATE_TRUNC('month',sale_date) AS month,

SUM(grand_total) AS amount

FROM sales

GROUP BY month

ORDER BY month;

CREATE VIEW low_stock AS

SELECT

medicine_name,

remaining_quantity

FROM medicines m

JOIN stock s

ON m.id=s.medicine_id

WHERE remaining_quantity<=minimum_stock;