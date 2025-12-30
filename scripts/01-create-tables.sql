-- Crear tabla de inventario
CREATE TABLE IF NOT EXISTS inventario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  año INTEGER NOT NULL,
  responsable TEXT NOT NULL,
  objeto TEXT NOT NULL,
  modelo TEXT NOT NULL,
  numero_serie TEXT NOT NULL UNIQUE,
  area TEXT NOT NULL,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Crear índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_inventario_año ON inventario(año);
CREATE INDEX IF NOT EXISTS idx_inventario_responsable ON inventario(responsable);
CREATE INDEX IF NOT EXISTS idx_inventario_objeto ON inventario(objeto);
CREATE INDEX IF NOT EXISTS idx_inventario_modelo ON inventario(modelo);
CREATE INDEX IF NOT EXISTS idx_inventario_numero_serie ON inventario(numero_serie);
CREATE INDEX IF NOT EXISTS idx_inventario_area ON inventario(area);

-- Habilitar Row Level Security
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden ver todos los registros
CREATE POLICY "Los usuarios autenticados pueden ver inventario"
  ON inventario
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Los usuarios autenticados pueden insertar registros
CREATE POLICY "Los usuarios autenticados pueden crear inventario"
  ON inventario
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política: Los usuarios autenticados pueden actualizar registros
CREATE POLICY "Los usuarios autenticados pueden actualizar inventario"
  ON inventario
  FOR UPDATE
  TO authenticated
  USING (true);

-- Política: Los usuarios autenticados pueden eliminar registros
CREATE POLICY "Los usuarios autenticados pueden eliminar inventario"
  ON inventario
  FOR DELETE
  TO authenticated
  USING (true);
