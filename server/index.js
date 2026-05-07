const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const app = express();
app.use(cors());
app.use(express.json());

// Set some defaults
db.defaults({ 
  clients: [], 
  projects: [], 
  notifications: [], 
  weeklyWorkHours: [],
  user: {},
  users: [],
  isLoggedIn: false
}).write();

// Endpoints
app.get('/', (req, res) => {
  res.send('<h3>Servidor de Base de Datos FlowDesk Activo</h3><p>La aplicación principal está en <a href="http://localhost:5173">http://localhost:5173</a></p><p>Datos: <a href="/api/data">/api/data</a></p>');
});

app.get('/api/data', (req, res) => {
  const data = { ...db.value() };
  delete data.users; // No exponer usuarios ni contraseñas
  res.json(data);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Robust check for users
  const users = db.get('users').value() || [];
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
  }
});

app.post('/api/register', (req, res) => {
  const { email, password, nombre } = req.body;
  const users = db.get('users').value() || [];
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'El usuario ya existe' });
  }
  
  const newUser = { email, password, nombre };
  db.get('users').push(newUser).write();
  
  res.json({ success: true, user: newUser });
});

app.post('/api/sync', (req, res) => {
  const currentData = db.value();
  const newData = req.body;
  
  // Preserve users if they are missing in the incoming sync (e.g. after a fetch)
  if (!newData.users && currentData.users) {
    newData.users = currentData.users;
  }
  
  db.setState(newData).write();
  res.json({ success: true });
});

// Specific updates for better performance (optional, but good for demo)
app.post('/api/clients', (req, res) => {
  db.set('clients', req.body).write();
  res.json({ success: true });
});

app.post('/api/projects', (req, res) => {
  db.set('projects', req.body).write();
  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Base de Datos FlowDesk funcionando en http://localhost:${PORT}`);
});
