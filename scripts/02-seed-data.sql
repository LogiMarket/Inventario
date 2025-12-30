-- Insertar datos de ejemplo
INSERT INTO inventario (año, responsable, objeto, modelo, numero_serie, area) VALUES
  (2024, 'Juan Pérez', 'Laptop', 'Dell XPS 15', 'SN001234567', 'TI'),
  (2024, 'María García', 'Monitor', 'LG UltraWide', 'SN007654321', 'Diseño'),
  (2023, 'Carlos Rodríguez', 'Teclado', 'Logitech MX Keys', 'SN001122334', 'TI'),
  (2023, 'Ana Martínez', 'Mouse', 'Logitech MX Master 3', 'SN005566778', 'Administración'),
  (2024, 'Luis Fernández', 'Laptop', 'HP EliteBook', 'SN009988776', 'Ventas'),
  (2024, 'Sofia López', 'Impresora', 'Canon ImageClass', 'SN003344556', 'Administración'),
  (2023, 'Pedro Sánchez', 'Scanner', 'Epson WorkForce', 'SN007788990', 'Archivo'),
  (2024, 'Laura Torres', 'Tablet', 'iPad Pro', 'SN001928374', 'Diseño')
ON CONFLICT (numero_serie) DO NOTHING;
