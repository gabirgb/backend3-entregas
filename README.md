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

==================================================

# ShipNow API — Pre-entrega Módulo 3

## Sistema Centralizado de Manejo de Errores

ShipNow API implementa una capa unificada de gestión de errores mediante el uso de errores personalizados, un diccionario de errores centralizado y un middleware global que intercepta los fallos de la aplicación.

### Estructura de Respuesta de Error

Todas las respuestas de error devuelven un formato JSON predecible y uniforme:

```json
{
  "status": "error",
  "code": "USER_NOT_FOUND",
  "message": "El usuario solicitado no existe en el sistema.",
  "cause": "No se encontró ningún usuario con el ID: 650d..."
}
```

==================================================

# ShipNow API — Pre-entrega Módulo 4

## Sistema de Logging y Monitoreo (Winston)

ShipNow API utiliza **Winston** junto con `winston-daily-rotate-file` para registrar eventos del servidor de forma estructurada y persistente.

### Niveles de Log Configurados

De mayor a menor severidad:

1. `fatal` (0): Fallas críticas que impiden el arranque o funcionamiento del sistema (ej. caída de MongoDB).
2. `error` (1): Errores inesperados del servidor (HTTP 500) con traza de pila (`stack trace`).
3. `warning` (2): Advertencias y errores operacionales esperados (HTTP 400/404, validaciones fallidas, rutas inexistentes).
4. `info` (3): Hitos normales del sistema (arranque del servidor, conexión a DB, creación de registros).
5. `http` (4): Registro automático de peticiones HTTP entrantes.
6. `debug` (5): Información técnica detallada para depuración interna.

### Comportamiento por Entorno (`NODE_ENV`)

- **Desarrollo (`development`)**: Muestra todos los logs en consola a partir de `debug` (con formato coloreado) y persiste errores (`error` y `fatal`) en archivo.
- **Producción (`production`)**: Filtra el ruido en consola mostrando desde `info` hacia arriba, y persiste tanto el historial general (`combined-YYYY-MM-DD.log`) como los errores críticos (`error-YYYY-MM-DD.log`).

### Persistencia, Rotación e Ignorados en Git

- Los archivos se almacenan en la carpeta raíz `/logs` con rotación diaria (`YYYY-MM-DD`), un límite de `20MB` por archivo y retención máxima de `14 días`.
- En `/logs/error-YYYY-MM-DD.log` **únicamente** se registran los niveles `error` y `fatal`.
- La carpeta `logs/` y los archivos `*.log` están excluidos del control de versiones mediante `.gitignore`.

### Cómo probar el Logger

1. Iniciar el servidor (`npm run dev` o `npm start`).
2. Realizar una petición `GET` a `http://localhost:8080/loggerTest`.
3. Verificar en la consola que se imprimen los 6 niveles con timestamp y verificar que se haya generado el archivo `logs/error-YYYY-MM-DD.log` conteniendo únicamente los mensajes de nivel `error` y `fatal`.
