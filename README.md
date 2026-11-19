# LabPC_backend

API backend de LabPC implementado con una arquitectura por capas. La persistencia se realiza en
MongoDB (`DATA_SOURCE=mongo`) o en una colección simulada en memoria (`DATA_SOURCE=memory`).

Documentación de contexto del backend: [`context/`](./context) (bitácora, contexto del proyecto y
contratos del API en [`context/API_CONTRACTS.md`](./context/API_CONTRACTS.md)).

## Arquitectura

```text
Application/
├── dtos/
├── interfaces/
├── results/
└── use-cases/

DLL/
├── context/
└── repositories/

LabPC/
├── controllers/
└── routes/

LabPC_BL/
├── interfaces/
└── services/

Domain/
```

## Requisitos

- Node.js 18 o superior.
- npm.

## Ejecutar el proyecto

Instalar dependencias:

```bash
npm install
```

Compilar TypeScript:

```bash
npm run build
```

Iniciar la API:

```bash
npm start
```

Por defecto, el servidor queda disponible en `http://localhost:4000`.
El puerto puede cambiarse mediante la variable de entorno `PORT`.

En desarrollo se puede utilizar:

```bash
npm run dev
```

## Base de datos (MongoDB local)

Copiar `.env.example` a `.env` y ajustar los valores:

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `PORT` | `4000` | Puerto del API |
| `DATA_SOURCE` | `mongo` si existe `MONGODB_URI`, si no `memory` | Fuente de datos |
| `MONGODB_URI` | `mongodb://localhost:27017/labpc` | Cadena de conexión |

Levantar MongoDB localmente (cualquiera de las dos opciones):

```bash
# Opción 1: Docker
docker compose up -d

# Opción 2: MongoDB Community Server instalado (servicio "MongoDB" o mongod)
mongod --dbpath ./data
```

Al iniciar con `DATA_SOURCE=mongo`, cada colección vacía (`users`, `laboratories`, `computers`,
`reservations`, `comments`) se llena con los datos semilla de
[`DLL/context/Seed.ts`](./DLL/context/Seed.ts). Con `DATA_SOURCE=memory` se usan esos mismos datos
en memoria y se reinician cada vez que se reinicia el servidor.

## Datos de prueba

| `id` | `name` | `email` | `password` | `role` |
|---|---|---|---|---|
| `1` | `admin` | `admin@labpc.local` | `admin123` | `3` (Admin) |
| `2` | `Ana López` | `ana.lopez@universidad.edu` | `labpc123` | `1` (Student) |
| `3` | `Encargado Lab.` | `encargado@universidad.edu` | `encargado123` | `3` (Admin) |

También se incluyen 5 laboratorios, 20 equipos (12 disponibles, 4 en uso, 3 reservados,
1 en mantenimiento), 14 reservas (12 de Ana: próximas, completadas y canceladas) y 5 incidencias.
Son los mismos datos que los mocks del frontend; las fechas son relativas al día en que se cargan.

Para reiniciar los datos de ejemplo en MongoDB (borra y vuelve a llenar las 5 colecciones):

```bash
npm run seed
```

Escenario de prueba: reservar **PC-07** pasado mañana a las **12:00** devuelve `409` (ya existe una
reserva a esa hora).

## Uso del API

Todas las respuestas utilizan JSON. Para las solicitudes con cuerpo se debe enviar:

```http
Content-Type: application/json
```

### Iniciar sesión

**Endpoint**

```http
POST /api/auth/login
```

**Cuerpo requerido**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `username` | `string` | Sí | Nombre o correo del usuario |
| `password` | `string` | Sí | Contraseña del usuario |

**Ejemplo con cURL en Windows**

```bat
curl -X POST http://localhost:4000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Ejemplo con cURL en Linux o macOS**

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Ejemplo con PowerShell**

```powershell
$body = @{
  username = "admin"
  password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:4000/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

**Respuesta exitosa: `200 OK`**

```json
{
  "user": {
    "id": 1,
    "name": "admin",
    "email": "admin@labpc.local",
    "role": 3
  }
}
```

**Credenciales inválidas: `401 Unauthorized`**

```json
{
  "error": "Las credenciales no son válidas."
}
```

También se devuelve `401` si falta `username` o `password`.

### Obtener un usuario

**Endpoint**

```http
GET /api/auth/users/:userId
```

**Parámetro de ruta**

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `userId` | `number` entero positivo | Sí | Identificador del usuario |

**Ejemplo con cURL**

```bash
curl http://localhost:4000/api/auth/users/1
```

**Ejemplo con PowerShell**

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:4000/api/auth/users/1" `
  -Method Get
```

**Respuesta exitosa: `200 OK`**

La respuesta utiliza el contenedor [`Contract<T>`](./Domain/README) del dominio:

```json
{
  "RespOp": 0,
  "Object": {
    "id": 1,
    "name": "admin",
    "email": "admin@labpc.local",
    "role": 3
  },
  "ObjectId": 1,
  "Response": "OK",
  "Total": 1,
  "Error": null
}
```

**Usuario no encontrado: `404 Not Found`**

```json
{
  "error": "Usuario no encontrado."
}
```

**Identificador inválido: `400 Bad Request`**

```json
{
  "error": "El identificador de usuario no es válido."
}
```

### Otros módulos

Todos los módulos nuevos responden con `Contract<T>` en éxito y `{ "error": "..." }` en error
(`400` validación, `404` no encontrado, `409` conflicto). El detalle de cada request/response está en
[`context/API_CONTRACTS.md`](./context/API_CONTRACTS.md).

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar usuario |
| `GET` | `/api/laboratories` | Listar laboratorios |
| `GET` | `/api/laboratories/:id` | Obtener laboratorio |
| `POST` | `/api/laboratories` | Crear laboratorio |
| `PUT` | `/api/laboratories/:id` | Actualizar laboratorio |
| `DELETE` | `/api/laboratories/:id` | Eliminar (lógico) laboratorio |
| `GET` | `/api/computers?laboratoryId=` | Listar equipos (filtro opcional) |
| `GET` | `/api/computers/:id` | Obtener equipo |
| `POST` | `/api/computers` | Crear equipo |
| `PUT` | `/api/computers/:id` | Actualizar equipo |
| `DELETE` | `/api/computers/:id` | Eliminar (lógico) equipo |
| `GET` | `/api/reservations/user/:userId` | Reservas de un usuario |
| `GET` | `/api/reservations/:id` | Obtener reserva |
| `POST` | `/api/reservations` | Crear reserva |
| `PATCH` | `/api/reservations/:id/cancel` | Cancelar reserva |
| `GET` | `/api/incidents` | Listar incidencias |
| `POST` | `/api/incidents` | Registrar incidencia |
| `PATCH` | `/api/incidents/:id/status` | Cambiar estado de incidencia |
| `GET` | `/api/admin/stats` | Indicadores del panel de administrador |

## Probar rápidamente

Con el servidor ejecutándose, estos comandos deben devolver respuestas:

```bash
curl http://localhost:4000/api/auth/users/1
```

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm install` | Instala las dependencias |
| `npm run build` | Compila TypeScript en `dist/` |
| `npm start` | Inicia la aplicación compilada |
| `npm run dev` | Inicia la aplicación mediante Nodemon |
| `npm test` | Ejecuta la compilación como validación |
| `npm run seed` | Reinicia los datos de ejemplo en MongoDB (`MONGODB_URI` del `.env`) |
