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
- **Historial de entrenamientos**: cada rutina completada queda registrada automáticamente con fecha, ejercicios realizados, series, reps y peso utilizado. El historial se puede consultar en cualquier momento y borrar por completo si se desea.
- **Diseño responsive**: la interfaz se adapta a pantallas de celular (inputs, botones, tipografía y el temporizador reescalan en breakpoints específicos), pensado para usarse durante el entrenamiento con el teléfono en mano.
- **Modales de confirmación propios**: las acciones destructivas (borrar ejercicio, rutina o historial) piden confirmación con un modal consistente con el diseño de la app, en vez de los diálogos nativos del navegador.
- **CRUD completo** contra una API REST propia para ejercicios y rutinas.

## Stack técnico

**Frontend**
- React 19 + React Router DOM 7
- Axios para consumo de API
- Vite como bundler
- Hooks y Context API propios (`useTimer`, `AuthContext`, `ConfirmContext`) para lógica y UI reutilizable sin librerías externas de estado

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

**Historial** (`/api/routine-logs`) — requiere token

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Lista el historial de rutinas completadas (más recientes primero) |
| POST | `/` | Registra una rutina como completada, con reps y peso reales por serie |
| DELETE | `/` | Borra todo el historial del usuario |

## Modelo de datos

Una **rutina** contiene un array de bloques de ejercicio, cada uno con referencia (`ObjectId`) a un ejercicio, series, peso, tipo de medición (`reps` o `time`) y tiempos de descanso. El modelo usa un validador (`pre('validate')`) que exige `reps` cuando `measureType` es `'reps'`, o `executionTime` cuando es `'time'` — así el esquema garantiza consistencia de datos según el tipo de ejercicio, sin depender de que el frontend mande el campo correcto.

Un **registro de historial** (`RoutineLog`) guarda una copia del nombre de la rutina y de cada ejercicio en el momento de completarse (no solo la referencia), junto con las series realmente ejecutadas (reps y peso). Esto evita que el historial quede roto o incompleto si la rutina o el ejercicio original se editan o eliminan más adelante.

## Decisiones técnicas

- **Temporizador basado en timestamps, no en conteo de ticks**: `useTimer` calcula el tiempo restante comparando `Date.now()` contra un timestamp de finalización, en vez de simplemente decrementar un contador en cada `setInterval`. Esto evita que el timer se desincronice cuando el navegador ralentiza los intervalos (por ejemplo, al perder el foco de la pestaña), algo crítico en una app pensada para usarse mientras se entrena con el teléfono bloqueado o en segundo plano.
- **Máquina de estados para la ejecución de rutina**: las fases de cada ejercicio (`execution`, `restBetweenSeries`, `restAfterExercise`) se modelan explícitamente como estados, lo que simplifica el manejo de transiciones (última serie → descanso post-ejercicio, último ejercicio → fin de rutina) sin condicionales anidados difíciles de mantener.
- **Medición dual (reps o tiempo)**: cada bloque de ejercicio dentro de una rutina puede medirse por repeticiones (avance manual del usuario) o por tiempo (avance automático del timer), cubriendo tanto ejercicios de fuerza como de resistencia/cardio.
- **Validación a nivel de esquema**: la regla que exige `reps` o `executionTime` según `measureType` vive en el modelo de Mongoose, no en el controlador ni en el frontend — así cualquier consumidor futuro de la API (otra app, un script, Postman) queda protegido por la misma regla de negocio.
- **`populate` en las consultas de rutinas**: el backend resuelve automáticamente la referencia a cada ejercicio (`exercises.exercise`) antes de responder, para que el frontend reciba el nombre y los datos del ejercicio sin tener que hacer requests adicionales.
- **Ownership a nivel de query, no solo de UI**: cada ejercicio y rutina tiene un campo `user` (referencia al dueño), y todos los controladores filtran por `{ _id, user: req.userId }` en lugar de buscar solo por `_id`. Esto evita vulnerabilidades de tipo IDOR (Insecure Direct Object Reference), donde un usuario autenticado podría leer o modificar datos de otro con solo adivinar o probar IDs ajenos.
- **Passwords hasheadas con bcrypt, nunca en texto plano**: el modelo de usuario nunca guarda la contraseña original; se almacena su hash. El login compara la contraseña ingresada contra ese hash sin necesidad de desencriptarlo.
- **Historial desnormalizado a propósito**: `RoutineLog` duplica el nombre de la rutina y de cada ejercicio en vez de depender solo de las referencias (`ObjectId`). Es una decisión deliberada de diseño: un registro histórico debe reflejar lo que pasó en su momento, no lo que la rutina es *ahora*. Si se sigue el patrón estándar de `populate`, borrar o renombrar una rutina rompería silenciosamente el historial pasado.
- **Confirmaciones como Promesa, no como callback**: `ConfirmContext` expone una función `confirm()` que devuelve una `Promise`, permitiendo escribir `const ok = await confirm({...})` en cualquier componente, con la misma sintaxis lineal que tenía `window.confirm`, pero renderizando un modal propio en vez de un diálogo nativo del navegador.

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
