# TrainingApp 🏋️‍♂️

Aplicación full stack (MERN) para crear rutinas de entrenamiento personalizadas y ejecutarlas guiado por un temporizador en tiempo real, con transición automática entre series, descansos y ejercicios.

🔗 **Demo:** [training-app-eight-sage.vercel.app](https://training-app-eight-sage.vercel.app/)
🔗 **API:** [trainingapp-yb70.onrender.com](https://trainingapp-yb70.onrender.com/)

> ⚠️ El backend está en el plan gratuito de Render, que "duerme" tras un período de inactividad. La primera carga puede tardar 30-50 segundos en despertar el servidor.

## Funcionalidades

- **Autenticación multiusuario**: registro e inicio de sesión con JWT. Cada usuario ve y gestiona únicamente sus propias rutinas y ejercicios; las rutas de la API están protegidas y validan la propiedad de cada recurso antes de permitir su lectura, edición o eliminación.
- **Gestión de ejercicios**: crear, editar y eliminar ejercicios propios (nombre, grupo muscular, descripción).
- **Gestión de rutinas**: crear rutinas compuestas por múltiples ejercicios, cada uno configurable con:
  - Series y peso
  - Tipo de medición: repeticiones o tiempo de ejecución
  - Descanso entre series y descanso posterior al ejercicio
  - Reordenamiento de ejercicios dentro de la rutina
- **Ejecución guiada de rutina en tiempo real**: al iniciar una rutina, la app lleva al usuario ejercicio por ejercicio y serie por serie mediante una máquina de estados (ejecución → descanso entre series → descanso post-ejercicio → siguiente ejercicio), con temporizador automático y opción de saltar descansos.
- **CRUD completo** contra una API REST propia para ejercicios y rutinas.

## Stack técnico

**Frontend**
- React 19 + React Router DOM 7
- Axios para consumo de API
- Vite como bundler
- Hook custom (`useTimer`) para el temporizador

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Autenticación con JWT (jsonwebtoken) y hasheo de contraseñas con bcrypt
- Arquitectura en capas: rutas → middlewares → controladores → modelos
- CORS + dotenv para configuración de entorno

## API REST

**Autenticación** (`/api/auth`) — pública

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/register` | Crea un usuario y devuelve un token JWT |
| POST | `/login` | Valida credenciales y devuelve un token JWT |

**Ejercicios** (`/api/exercises`) — requiere token

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista todos los ejercicios (ordenados por nombre) |
| GET | `/:id` | Obtiene un ejercicio por ID |
| POST | `/` | Crea un ejercicio |
| PATCH | `/:id` | Actualiza un ejercicio |
| DELETE | `/:id` | Elimina un ejercicio |

**Rutinas** (`/api/routines`) — requiere token

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista todas las rutinas (con ejercicios poblados, más recientes primero) |
| GET | `/:id` | Obtiene una rutina por ID (con ejercicios poblados) |
| POST | `/` | Crea una rutina |
| PATCH | `/:id` | Actualiza una rutina |
| DELETE | `/:id` | Elimina una rutina |

## Modelo de datos

Una **rutina** contiene un array de bloques de ejercicio, cada uno con referencia (`ObjectId`) a un ejercicio, series, peso, tipo de medición (`reps` o `time`) y tiempos de descanso. El modelo usa un validador (`pre('validate')`) que exige `reps` cuando `measureType` es `'reps'`, o `executionTime` cuando es `'time'` — así el esquema garantiza consistencia de datos según el tipo de ejercicio, sin depender de que el frontend mande el campo correcto.

## Decisiones técnicas

- **Temporizador basado en timestamps, no en conteo de ticks**: `useTimer` calcula el tiempo restante comparando `Date.now()` contra un timestamp de finalización, en vez de simplemente decrementar un contador en cada `setInterval`. Esto evita que el timer se desincronice cuando el navegador ralentiza los intervalos (por ejemplo, al perder el foco de la pestaña), algo crítico en una app pensada para usarse mientras se entrena con el teléfono bloqueado o en segundo plano.
- **Máquina de estados para la ejecución de rutina**: las fases de cada ejercicio (`execution`, `restBetweenSeries`, `restAfterExercise`) se modelan explícitamente como estados, lo que simplifica el manejo de transiciones (última serie → descanso post-ejercicio, último ejercicio → fin de rutina) sin condicionales anidados difíciles de mantener.
- **Medición dual (reps o tiempo)**: cada bloque de ejercicio dentro de una rutina puede medirse por repeticiones (avance manual del usuario) o por tiempo (avance automático del timer), cubriendo tanto ejercicios de fuerza como de resistencia/cardio.
- **Validación a nivel de esquema**: la regla que exige `reps` o `executionTime` según `measureType` vive en el modelo de Mongoose, no en el controlador ni en el frontend — así cualquier consumidor futuro de la API (otra app, un script, Postman) queda protegido por la misma regla de negocio.
- **`populate` en las consultas de rutinas**: el backend resuelve automáticamente la referencia a cada ejercicio (`exercises.exercise`) antes de responder, para que el frontend reciba el nombre y los datos del ejercicio sin tener que hacer requests adicionales.
- **Ownership a nivel de query, no solo de UI**: cada ejercicio y rutina tiene un campo `user` (referencia al dueño), y todos los controladores filtran por `{ _id, user: req.userId }` en lugar de buscar solo por `_id`. Esto evita vulnerabilidades de tipo IDOR (Insecure Direct Object Reference), donde un usuario autenticado podría leer o modificar datos de otro con solo adivinar o probar IDs ajenos.
- **Passwords hasheadas con bcrypt, nunca en texto plano**: el modelo de usuario nunca guarda la contraseña original; se almacena su hash. El login compara la contraseña ingresada contra ese hash sin necesidad de desencriptarlo.

## Variables de entorno

El servidor valida al arrancar que existan estas variables (si falta alguna, lanza un error y no levanta):

```
PORT=3030
NODE_ENV=development
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/trainingapp
JWT_SECRET=una_clave_larga_y_random
```

## Instalación y uso

### Backend
```bash
cd server
npm install
# crear un archivo .env con PORT, NODE_ENV y MONGO_URI
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

La app corre en modo desarrollo con Vite; el cliente consume la API en `http://localhost:3030/api`.

## Autor

Agustín Rodríguez — [agustinlihuel@gmail.com](mailto:agustinlihuel@gmail.com)