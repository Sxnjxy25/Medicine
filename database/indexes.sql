-- Medicine search
CREATE INDEX idx_medicine_name
ON medicines(medicine_name);

CREATE INDEX idx_generic_name
ON medicines(generic_name);

CREATE INDEX idx_company
ON medicines(company);

CREATE INDEX idx_qr_code
ON medicines(qr_code);

CREATE INDEX idx_barcode
ON medicines(barcode);

-- Stock search
CREATE INDEX idx_expiry
ON stock(expiry_date);

CREATE INDEX idx_batch
ON stock(batch_number);

-- Sales
CREATE INDEX idx_sale_date
ON sales(sale_date);
