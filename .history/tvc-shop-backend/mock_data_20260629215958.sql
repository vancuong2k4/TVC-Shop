USE tvc_shop;

-- Xóa dữ liệu cũ (nếu có) để tránh trùng lặp
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_variants;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
SET FOREIGN_KEY_CHECKS = 1;

-- Thêm Danh mục (Categories)
INSERT INTO categories (id, name, slug, parent_id) VALUES 
(1, 'Thời Trang Nam', 'thoi-trang-nam', NULL),
(2, 'Thời Trang Nữ', 'thoi-trang-nu', NULL),
(3, 'Phụ Kiện', 'phu-kien', NULL);

-- Thêm Sản phẩm (Products)
INSERT INTO products (id, category_id, name, slug, description, price, discount_price, status) VALUES 
(1, 1, 'Áo Khoác Blazer Minimalist Nam', 'ao-khoac-blazer-minimalist-nam', 'Blazer dáng chuẩn, chất liệu cao cấp mang lại vẻ ngoài lịch lãm.', 150.00, 120.00, 'active'),
(2, 2, 'Sơ Mi Cotton Trắng Nữ', 'so-mi-cotton-trang-nu', 'Sơ mi nữ thanh lịch, dễ phối đồ công sở hoặc dạo phố.', 45.00, NULL, 'active'),
(3, 1, 'Quần Âu Dáng Suông Nam', 'quan-au-dang-suong-nam', 'Quần âu nam xếp ly, co giãn nhẹ.', 65.00, NULL, 'active'),
(4, 3, 'Túi Xách Da Cao Cấp', 'tui-xach-da-cao-cap', 'Túi xách da thật 100%, thiết kế tinh tế và đẳng cấp.', 110.00, 89.00, 'active'),
(5, 2, 'Áo Len Tăm Mùa Thu', 'ao-len-tam-mua-thu', 'Áo len nữ mỏng, mềm mịn phù hợp thời tiết giao mùa.', 55.00, NULL, 'active'),
(6, 1, 'Giày Da Cổ Điển Oxford', 'giay-da-co-dien-oxford', 'Giày da thật sang trọng cho quý ông.', 110.00, NULL, 'active'),
(7, 1, 'Áo Phông Đen Basic', 'ao-phong-den-basic', 'Áo thun cotton thoáng mát, không bai nhão.', 25.00, NULL, 'active'),
(8, 3, 'Kính Mát Thời Trang Gọng Kim Loại', 'kinh-mat-thoi-trang', 'Kính mát chống tia UV400, thiết kế unisex.', 50.00, 35.00, 'active');

-- Thêm Ảnh Sản phẩm (Product Images)
INSERT INTO product_images (product_id, image_url, is_primary) VALUES 
(1, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop', 1),
(2, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1925&auto=format&fit=crop', 1),
(3, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop', 1),
(4, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1938&auto=format&fit=crop', 1),
(5, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1972&auto=format&fit=crop', 1),
(6, 'https://images.unsplash.com/photo-1614252235316-52ce280f5a7e?q=80&w=1887&auto=format&fit=crop', 1),
(7, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop', 1),
(8, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop', 1);

-- Thêm Biến thể (Product Variants - Kích cỡ, Màu sắc, Số lượng)
INSERT INTO product_variants (product_id, color, size, stock) VALUES 
(1, 'Black', 'M', 10), (1, 'Black', 'L', 15),
(2, 'White', 'S', 20), (2, 'White', 'M', 20),
(3, 'Navy', '32', 30), (3, 'Navy', '34', 10),
(4, 'Brown', 'Free Size', 5),
(5, 'Beige', 'M', 25),
(6, 'Black', '42', 8), (6, 'Black', '43', 10),
(7, 'Black', 'L', 50),
(8, 'Gold', 'Free Size', 15);
