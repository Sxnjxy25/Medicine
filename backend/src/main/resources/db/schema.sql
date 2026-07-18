CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK(role IN ('ADMIN','STAFF')),
    phone VARCHAR(15),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    gst_number VARCHAR(30)
);
CREATE TABLE racks (
    id SERIAL PRIMARY KEY,
    rack_name VARCHAR(20),
    shelf_number INT,
    box_number INT,
    description TEXT
);
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,

    medicine_code VARCHAR(30) UNIQUE NOT NULL,

    qr_code VARCHAR(100) UNIQUE,

    barcode VARCHAR(100),

    medicine_name VARCHAR(150) NOT NULL,

    generic_name VARCHAR(150),

    company VARCHAR(100),

    category VARCHAR(100),

    purchase_price NUMERIC(10,2),

    selling_price NUMERIC(10,2),

    gst NUMERIC(5,2),

    rack_id INT REFERENCES racks(id),

    minimum_stock INT DEFAULT 10,

    image_url TEXT,

    status BOOLEAN DEFAULT TRUE
);
CREATE TABLE purchases (

    id SERIAL PRIMARY KEY,

    supplier_id INT REFERENCES suppliers(id),

    invoice_number VARCHAR(50),

    purchase_date DATE,

    total_amount NUMERIC(12,2)
);
CREATE TABLE stock (

    id SERIAL PRIMARY KEY,

    medicine_id INT REFERENCES medicines(id),

    purchase_id INT REFERENCES purchases(id),

    batch_number VARCHAR(50),

    manufacture_date DATE,

    expiry_date DATE,

    quantity INT,

    remaining_quantity INT
);
CREATE TABLE customers (

    id SERIAL PRIMARY KEY,

    customer_name VARCHAR(100),

    phone VARCHAR(20)
);
CREATE TABLE sales (

    id SERIAL PRIMARY KEY,

    invoice_number VARCHAR(30),

    customer_id INT REFERENCES customers(id),

    user_id INT REFERENCES users(id),

    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    total_amount NUMERIC(12,2),

    discount NUMERIC(10,2),

    gst NUMERIC(10,2),

    grand_total NUMERIC(12,2),

    payment_mode VARCHAR(20)
);
CREATE TABLE sale_items (

    id SERIAL PRIMARY KEY,

    sale_id INT REFERENCES sales(id),

    medicine_id INT REFERENCES medicines(id),

    stock_id INT REFERENCES stock(id),

    quantity INT,

    price NUMERIC(10,2),

    subtotal NUMERIC(12,2)
);
CREATE TABLE payments (

    id SERIAL PRIMARY KEY,

    sale_id INT REFERENCES sales(id),

    payment_type VARCHAR(30),

    amount NUMERIC(12,2),

    transaction_id VARCHAR(100),

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE notifications (

    id SERIAL PRIMARY KEY,

    medicine_id INT REFERENCES medicines(id),

    notification_type VARCHAR(50),

    message TEXT,

    status BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE audit_logs (

    id SERIAL PRIMARY KEY,

    user_id INT REFERENCES users(id),

    action VARCHAR(200),

    table_name VARCHAR(100),

    record_id INT,

    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);