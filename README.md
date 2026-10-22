# LabPC_backend

API backend de LabPC implementado con una arquitectura por capas y persistencia simulada en memoria.

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

## Datos de prueba

La aplicación inicia con un usuario en memoria:

| Campo | Valor |
|---|---|
| `id` | `1` |
| `name` | `admin` |
| `email` | `admin@labpc.local` |
| `password` | `admin123` |

Los datos no se guardan en MongoDB todavía. Se reinician cada vez que se reinicia el servidor.

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
    "role": 0
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

```json
{
  "id": 1,
  "name": "admin",
  "email": "admin@labpc.local",
  "role": 0
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
