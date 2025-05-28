# Frontend - Plataforma E-commerce

Este proyecto es la interfaz de usuario para un sistema de e-commerce básico que permite a los usuarios registrarse, iniciar sesión, visualizar productos, agregarlos al carrito, realizar compras y ver su historial de pedidos.

## Tecnologías utilizadas

- **React (Vite + JSX)**

- **React Router DOM para navegación**

- **CSS personalizado**

- **Fetch API para comunicación con el backend**

- **JWT (manejo de tokens en localStorage)**

## Vistas principales

/login	Formulario de inicio de sesión

/register	Formulario de registro de nuevos usuarios

/home	Lista de productos disponibles para comprar

/cart	Carrito de compras con opción de modificar cantidades o eliminar productos

/checkout (modal)	Formulario de pago simulado con dirección, tarjeta, etc.

/orders	Historial de pedidos del usuario autenticado

## Instrucciones para correr el proyecto

1. Tener instalado Git en tu maquina local 
2. Elegir una carpeta en donde guardes tu proyecto
3. abrir la terminal de GIT --> mediante el clik derecho seleccionas Git bash here
4. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/andreec2/PruebaTecnicaSemilleroFront.git
   ```
5. Abre el proyecto con tu IDE favorito o navega hasta el directorio del proyecto 
6. Desde la terminal  para compilar el proyecto ejecuta:

   ```bash
   npm install
   ```
7. Corra el proyecto 

   ```bash
    npm run dev
   ```

- **La aplicación estará disponible en: http://localhost:5173**


## Autenticación

Los tokens JWT se almacenan en localStorage (token y email) al iniciar sesión o registrarse.

El frontend incluye lógica para redireccionar al usuario si no está autenticado en vistas protegidas como /cart y /orders.

## Funcionalidades implementadas

Registro e inicio de sesión de usuarios

Vista de productos

Carrito persistente por usuario

Eliminación y edición de productos en el carrito

Proceso de pago simulado mediante formulario emergente

Historial de compras

Redirección si el carrito está vacío

Estilos responsivos y UI accesible

## Conexión con el backend 

Este frontend se conecta a un backend Spring Boot disponible en http://localhost:8080.
Las rutas utilizadas incluyen:

- **POST /api/auth/login**

- **POST /api/auth/register**

- **GET /api/products**

- **GET /api/cart/{email}**
  
- **POST /api/cart/{email}/checkout**

- **GET /api/orders/{email}**

## Authors

* **Andres felipe montes ortiz** - 
* **@andreec2** - 

## Licencia

Este proyecto fue desarrollado con fines académicos/técnicos como parte de una prueba. El uso es libre y educativo.





