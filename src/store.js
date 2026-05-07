import { create } from 'zustand';
import { db, auth } from './lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword
} from 'firebase/auth';

export const useStore = create((set, get) => ({
  clients: [],
  projects: [],
  notifications: [],
  weeklyWorkHours: [],
  lastResetWeek: null,
  user: {},
  isLoggedIn: false,
  loading: true,
  collaborators: [
    { id: 'colab1', nombre: 'Marta', especialidad: 'Fotografía', foto: 'https://i.pravatar.cc/150?img=32' },
    { id: 'colab2', nombre: 'Pablo', especialidad: 'Copywriter', foto: 'https://i.pravatar.cc/150?img=12' },
    { id: 'colab3', nombre: 'Elena', especialidad: 'Ilustración', foto: 'https://i.pravatar.cc/150?img=47' },
    { id: 'colab4', nombre: 'Jorge', especialidad: 'Motion Designer', foto: 'https://i.pravatar.cc/150?img=11' }
  ],

  // Initialization & Sync
  fetchData: async () => {
    // This is now handled by the auth observer in App.jsx or here
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Check for week reset
        const currentWeek = getWeekNumber(new Date());
        if (data.lastResetWeek !== currentWeek) {
          data.weeklyWorkHours = [
            { day: 'L', hours: 0, height: 0 },
            { day: 'M', hours: 0, height: 0 },
            { day: 'X', hours: 0, height: 0 },
            { day: 'J', hours: 0, height: 0 },
            { day: 'V', hours: 0, height: 0 },
            { day: 'S', hours: 0, height: 0 },
            { day: 'D', hours: 0, height: 0 }
          ];
          data.lastResetWeek = currentWeek;
          set({ ...data, isLoggedIn: true });
          await get().sync();
        } else {
          set({ ...data, isLoggedIn: true });
        }
      } else {
        // Initial state for new user seeded from db.json
        const initialState = {
          clients: [
            {
              "nombre": "Maria",
              "especialidad": "Tienda de ropa",
              "telefono": "658595454",
              "email": "maria@gmail.com",
              "notas": "tienda de ropa online",
              "foto": "https://i.pravatar.cc/150?img=46",
              "id": "1778148443705",
              "ingresos": 0
            }
          ],
          projects: [
            {
              "titulo": "Creación de un libro ilustrado",
              "cliente_id": "1778148443705",
              "categoria": "Ilustración",
              "fecha_entrega": "2026-05-14",
              "presupuesto": 300,
              "estado": "pendiente",
              "descripcion": "Este proyecto consiste en la creación de un libro ilustrado para la editorial de María. Los datos son los siquientes:\n- 20 ilustraciones\n-portada y contra portada\n- temática amorosa",
              "imagen": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
              "progreso": 100,
              "fecha_inicio": "2026-05-07",
              "urgencia": "normal",
              "id": "1778150387192",
              "tasks": [
                { "name": "Research", "completed": true },
                { "name": "Concept Design", "completed": true },
                { "name": "Client Feedback", "completed": true },
                { "name": "Final Delivery", "completed": true }
              ],
              "descripcion_corta": "Un proyecto de ilustración infantil.",
              "pagado": true,
              "notas_tablero": [
                { "id": 1778169217010, "text": "necesario: feedback del cliente para mañana urgente", "color": "#fef3c7" }
              ],
              "colaboradores": ["Pablo", "Manuela"]
            },
            {
              "titulo": "Rediseño de marca 90º",
              "cliente_id": "1778148443705",
              "categoria": "Branding",
              "fecha_entrega": "2026-05-22",
              "presupuesto": 200,
              "estado": "pendiente",
              "descripcion": "",
              "imagen": "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop",
              "progreso": 75,
              "fecha_inicio": "2026-05-07",
              "urgencia": "normal",
              "id": "1778151083249",
              "tasks": [
                { "name": "Investigación", "completed": true },
                { "name": "Diseño de Concepto", "completed": true },
                { "name": "Feedback del Cliente", "completed": true },
                { "name": "Entrega Final", "completed": false }
              ],
              "descripcion_corta": "Rebranding completo de todo el material del café."
            }
          ],
          notifications: [],
          weeklyWorkHours: [
            { "day": "L", "hours": 1.5, "height": 15 },
            { "day": "M", "hours": 0.5, "height": 5 },
            { "day": "X", "hours": 5, "height": 50 },
            { "day": "J", "hours": 6, "height": 60 },
            { "day": "V", "hours": 8, "height": 80 },
            { "day": "S", "hours": 0, "height": 0 },
            { "day": "D", "hours": 0, "height": 0 }
          ],
          lastResetWeek: getWeekNumber(new Date()),
          user: {
            nombre: currentUser.displayName || 'Nuevo Usuario',
            email: currentUser.email,
            foto: 'https://i.pravatar.cc/150?img=12',
            biografia: '',
            notificaciones: true,
            idioma: 'Español'
          }
        };
        await setDoc(docRef, initialState);
        set({ ...initialState, isLoggedIn: true });
      }
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  },

  sync: async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const { clients, projects, notifications, weeklyWorkHours, lastResetWeek, user } = get();
      await setDoc(doc(db, 'users', currentUser.uid), {
        clients, projects, notifications, weeklyWorkHours, lastResetWeek, user
      }, { merge: true });
    } catch (error) {
      console.error('Error syncing with Firebase:', error);
    }
  },

  // Auth Actions
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ isLoggedIn: true });
      await get().fetchData();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Usuario o contraseña incorrectos';
      }
      return { success: false, message };
    }
  },

  register: async (email, password, nombre) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const initialState = {
        clients: [],
        projects: [],
        notifications: [],
        weeklyWorkHours: [
          { day: 'L', hours: 0, height: 0 },
          { day: 'M', hours: 0, height: 0 },
          { day: 'X', hours: 0, height: 0 },
          { day: 'J', hours: 0, height: 0 },
          { day: 'V', hours: 0, height: 0 },
          { day: 'S', hours: 0, height: 0 },
          { day: 'D', hours: 0, height: 0 }
        ],
        lastResetWeek: getWeekNumber(new Date()),
        user: {
          nombre,
          email,
          foto: 'https://i.pravatar.cc/150?img=12',
          biografia: '',
          notificaciones: true,
          idioma: 'Español'
        }
      };
      
      await setDoc(doc(db, 'users', user.uid), initialState);
      set({ ...initialState, isLoggedIn: true });
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let message = 'Error al registrarse';
      if (error.code === 'auth/email-already-in-use') {
        message = 'El email ya está en uso';
      }
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ 
        isLoggedIn: false, 
        user: {}, 
        clients: [], 
        projects: [], 
        notifications: [], 
        weeklyWorkHours: [] 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Notifications Actions
  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
    await get().sync();
  },

  clearNotifications: async () => {
    set({ notifications: [] });
    await get().sync();
  },

  // Work Hours Actions
  updateWorkHours: async (day, hours) => {
    set((state) => {
      const newHours = state.weeklyWorkHours.map(d => {
        if (d.day === day) {
          const height = Math.min((hours / 10) * 100, 100);
          return { ...d, hours, height };
        }
        return d;
      });
      return { weeklyWorkHours: newHours };
    });
    await get().sync();
  },

  updateWeeklyWorkHours: async (hoursMap) => {
    set((state) => {
      const newHours = state.weeklyWorkHours.map(d => {
        const hours = hoursMap[d.day] || 0;
        const height = Math.min((hours / 10) * 100, 100);
        return { ...d, hours, height };
      });
      return { weeklyWorkHours: newHours };
    });
    await get().sync();
  },

  // Profile Actions
  updateProfile: async (updatedData) => {
    set((state) => ({
      user: { ...state.user, ...updatedData }
    }));
    await get().sync();
  },

  changePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updatePassword(user, newPassword);
        return { success: true };
      }
      return { success: false, message: 'No hay usuario autenticado' };
    } catch (error) {
      console.error('Error changing password:', error);
      return { success: false, message: 'Error al cambiar la contraseña' };
    }
  },

  // Client Actions
  addClient: async (client) => {
    set((state) => ({ 
      clients: [...state.clients, { ...client, id: Date.now().toString(), ingresos: 0 }] 
    }));
    await get().sync();
  },

  updateClient: async (id, updatedClient) => {
    set((state) => ({
      clients: state.clients.map(c => c.id === id ? { ...c, ...updatedClient } : c)
    }));
    await get().sync();
  },

  deleteClient: async (id) => {
    set((state) => ({
      clients: state.clients.filter(c => c.id !== id)
    }));
    await get().sync();
  },

  // Project Actions
  addProject: async (project) => {
    const newId = Date.now().toString();
    set((state) => ({ 
      projects: [...state.projects, { ...project, id: newId, pagado: false }] 
    }));
    get().sync();
    return newId;
  },

  updateProject: async (projectId, updatedData) => {
    const projects = get().projects;
    const updatedProjects = projects.map(p => 
      String(p.id) === String(projectId) ? { ...p, ...updatedData } : p
    );
    set({ projects: updatedProjects });
    get().sync();
  },

  toggleProjectPayment: async (projectId) => {
    const projects = get().projects;
    const updatedProjects = projects.map(p => 
      String(p.id) === String(projectId) ? { ...p, pagado: !p.pagado } : p
    );
    set({ projects: updatedProjects });
    await get().sync();
  },

  addBoardNote: async (projectId, noteText, noteImage = null) => {
    const projects = get().projects;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const notes = p.notas_tablero || [];
        return { 
          ...p, 
          notas_tablero: [
            ...notes, 
            { 
              id: Date.now(), 
              text: noteText, 
              image: noteImage,
              color: ['#fef3c7', '#dcfce7', '#e0f2fe', '#fce7f3'][notes.length % 4] 
            }
          ] 
        };
      }
      return p;
    });
    set({ projects: updatedProjects });
    await get().sync();
  },

  deleteBoardNote: async (projectId, noteId) => {
    const projects = get().projects;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, notas_tablero: (p.notas_tablero || []).filter(n => n.id !== noteId) };
      }
      return p;
    });
    set({ projects: updatedProjects });
    await get().sync();
  },

  deleteProject: async (id) => {
    set((state) => ({
      projects: state.projects.filter(p => p.id !== id)
    }));
    await get().sync();
  },

  toggleProjectTask: async (projectId, taskIndex) => {
    set((state) => {
      const updatedProjects = state.projects.map(p => {
        if (p.id === projectId) {
          const tasks = p.tasks || [
            { name: 'Investigación', completed: false },
            { name: 'Diseño de Concepto', completed: false },
            { name: 'Feedback del Cliente', completed: false },
            { name: 'Entrega Final', completed: false }
          ];
          
          const updatedTasks = [...tasks];
          updatedTasks[taskIndex].completed = !updatedTasks[taskIndex].completed;
          
          const completedCount = updatedTasks.filter(t => t.completed).length;
          const newProgress = Math.round((completedCount / updatedTasks.length) * 100);
          
          return { ...p, tasks: updatedTasks, progreso: newProgress };
        }
        return p;
      });
      return { projects: updatedProjects };
    });
    await get().sync();
  },

  // Selectors
  getClient: (id) => get().clients.find(c => c.id === id),
  getProject: (id) => get().projects.find(p => p.id === id),
  getClientProjects: (clientId) => get().projects.filter(p => p.cliente_id === clientId),
  
  getStats: () => {
    const { projects, clients } = get();
    return {
      activeProjects: projects.filter(p => p.estado !== 'completado').length,
      newClients: clients.length,
      totalRevenue: projects.filter(p => p.pagado).reduce((acc, p) => acc + (parseFloat(p.presupuesto) || 0), 0)
    };
  }
}));

// Auth Observer
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await useStore.getState().fetchData();
    useStore.setState({ loading: false });
  } else {
    useStore.setState({ isLoggedIn: false, user: {}, clients: [], projects: [], notifications: [], weeklyWorkHours: [], loading: false });
  }
});

// Helper to get week number (ISO-8601)
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}
