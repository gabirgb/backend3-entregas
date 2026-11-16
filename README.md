# ShipNow API — Pre-entrega Módulo 1

## Proyecto base

Refactorización de la API base de **ShipNow** hacia una arquitectura profesional en 3 capas (`Controller → Service → Repository`), con validación centralizada de variables de entorno y dominio gobernado por constantes inmutables.

## Requisitos previos

- Node.js v18+
- Instancia de MongoDB (local o MongoDB Atlas)

## Instalación y ejecución local

1. Clonar el repositorio:
   ```bash
   git clone <URL_DE_TU_REPO>
   cd shipnow-api
   ```

==================================================

# ShipNow API — Pre-entrega Módulo 2

## Mocking y Seeding (`/api/mocks`)

La API cuenta con un módulo dedicado a la generación de datos de prueba utilizando `@faker-js/faker`, respetando la arquitectura por capas y las constantes del dominio.

### Endpoints disponibles:

1. **Obtener usuarios simulados (Sin guardar en DB):**
   - **GET** `/api/mocks/users?qty=5`
   - _Descripción:_ Retorna un array de usuarios simulados con roles válidos (`ADMIN`, `USER`, `DELIVERY`).

2. **Obtener productos simulados (Sin guardar en DB):**
   - **GET** `/api/mocks/products?qty=5`
   - _Descripción:_ Retorna productos simulados con stock, precios y estados dinámicos.

3. **Carga masiva de datos de prueba en MongoDB (Seeding):**
   - **POST** `/api/mocks/seed?qty=10`
   - _Descripción:_ Inserta en la base de datos la cantidad especificada de usuarios, productos, órdenes y entregas, manteniendo íntegras las relaciones relacionales entre colecciones.
