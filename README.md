# Gatro tour — Final Desarrollo Web

Aplicación web para registrar y compartir reseñas de restaurantes.

## Integrantes
- Bryan Arias Ríos
- Simón Rivera Munera
- Juan José García Villegas

## Tecnologías
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB

## Arquitectura
Frontend (React) → Backend (Node.js) → MongoDB

## Funcionalidades
- Registro e inicio de sesión con JWT
- Token almacenado en sessionStorage
- CRUD de reseñas de restaurantes
- Visualización de reseñas de todos los usuarios
- Edición y eliminación solo de reseñas propias

## Estructura del proyecto
final_desarrolloWeb/
├── frontend/   # React + Vite
└── Backend/    # Node.js + Express

## Instalación

### Backend
```bash
cd Backend
npm install

node index.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno (Backend)
MONGO_URI=mongodb://localhost:27017/resenas_restaurantes
PORT=1702

