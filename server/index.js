import express from "express";
import cors from "cors";
import { PORT } from "./config.js";

const app = express();

// CORS configurado para localhost y Render
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://mern-frontend-w0sl.onrender.com'
    ],
  })
);

app.use(express.json());

// Mock de base de datos
let users = [
  { id: 1, name: "Juan", email: "juan@example.com" },
  { id: 2, name: "María", email: "maria@example.com" },
  { id: 3, name: "Carlos", email: "carlos@example.com" },
];

// ===== RUTAS =====

// GET - Obtener todos los usuarios
app.get("/api/users", (req, res) => {
  res.json(users);
});

// POST - Crear nuevo usuario
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: "Nombre y email son requeridos" });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// GET - Obtener usuario por ID
app.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  
  res.json(user);
});

// PUT - Actualizar usuario
app.put("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  
  res.json(user);
});

// DELETE - Eliminar usuario
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  
  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
});

// GET - Ruta de prueba
app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend funcionando correctamente!" });
});

// GET - Ping
app.get("/ping", (req, res) => {
  res.send({
    pong: new Date().toISOString(),
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(` Server started on port ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api`);
  console.log(' Rutas disponibles:');
  console.log('   GET  /api/users');
  console.log('   POST /api/users');
  console.log('   GET  /api/users/:id');
  console.log('   PUT  /api/users/:id');
  console.log('   DELETE /api/users/:id');
});