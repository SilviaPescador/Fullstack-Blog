# Spelkit Blog - By Silvia Pescador

## PUESTA EN MARCHA DE SPELKIT BLOG

### MySQL 
La base de datos se encuentra en `/backend/db/next-blog-db.sql`

Impórtala en phpMyAdmin o el entorno de ejecución de SQL que prefieras.

### BACKEND (express) : Inicialización

_Para inicializar el servidor, sigue los siguientes pasos_

coloca el .env en la raiz de /backend:
```
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_NAME=blog_bd
```

```bash
cd backend
npm install
npm run dev
```

### FRONTEND (next.js): Inicialización

_Para inicializar el cliente, sigue los siguientes pasos_

```bash
cd frontend
npm install
npm run dev
```

## OBJETIVOS DEL PROYECTO 

	Demostrar habilidades y conocimientos técnicos en el desarrollo web.
	Familiarizarse con el framework Next.js, incluyendo el uso de sus capacidades de servidor.
	Implementar un sistema CRUD (Create, Read, Update, Delete) para las entradas del blog.
	Crear una interfaz de usuario atractiva y responsiva utilizando CSS (bootstrap).
	Integrar la funcionalidad de subida y manejo de imágenes en el servidor.

### Motivaciones

En este proyecto, he tomado mi primer contacto con Next.js, de cara a la escalabilidad posterior y a mi aprendizaje personal. 

 		Componentes: Link, Image, Head
		Hooks: next/router
		Routing; /Pages router

Por el momento se ha creado el servidor de forma independiente, aunque posteriormente lo incluiré en la misma app, mejorando así el rendimiento y funcionalidades. 

Cabe destacar que no he usado todas las posibilidades que ofrece Next.js:
ROUTING: las rutas están (por el momento) establecidas a través del PAGES ROUTING  de nextjs. 
En la última versión , Next.js 13, se recomienda migrar a App Router[App Router DOC](https://nextjs.org/docs/pages), y se implementará en un futuro.
[Next.js DOC](https://nextjs.org/docs/pages/building-your-application)

## DISEÑO VISUAL Y RESPONSIVIDAD: 

### Diseño
Se creó un espacio online personal donde plasmar ideas, noticias e intereses varios, con clara tendencia hacia las tecnologías y la inteligencia artificial. 

Todas las imágenes que aparecen en el blog son creadas por el Creador de Imágenes de Bing, al cual existe un enlace en la página para crear una nueva entrada. 

He optado por conservar un diseño sencillo y claro, que no esté recargado, de cara a posteriores peticiones del cliente, y aminorar la complejidad de la responsividad de cara a futuras refactorizaciones o añadidos. 

### Responsividad: 

Se ha cuidado la responsividad utilizando el framework Bootstrap como principal agente de estilo, añadiendo clases funcionales en distintos tamaños de pantalla.

Asimismo una estructura organizada del código dio pie a que resulte sencillo corregir cualquier inconveniente.


## STACK TECNOLÓGICO 
### Frontend: 

Next.js 13, React, CSS + Bootstrap.

Librerías destacadas: 
`react-dropzone` -> carga de imágenes en los posts. USO: `components/imageUploader.js`  (uso en creación y en update de los posts)

[Dropzone DOC](https://react-dropzone.js.org/)  
`bootstrap@5.3.0`, `bootstrap-icons` -> diseño y responsividad de la web.
`axios` -> establecimiento de comunicación con el servidor independiente creado. (peticiones http) USO: `services/postService.js`
`swr` -> Biblioteca SWR para la obtención de datos en index.js (home) -> obtención de los posts

 [SWR DOC](https://swr.vercel.app/es-ES)
`react-hook-form` -> manejo de recogida de datos en formularios e inputs. USO: `newPostCard.js` y `postArticle.js`

### Backend:

Node.js con Express.
La creación inicial del servidor se ha realizado con la funcionalidad `express-generator` que proporciona una estructura inicial y la configuración de middlewares de error.

Librerías adicionales: 
`multer` -> middleware para la gestión y guardado de las imágenes obtenidas en el servidor. USO: `routes/posts.js`

[Multer DOC](https://github.com/expressjs/multer)

`fs` y `path`-> librerías integradas para la lectura, ruta y edición de las imágenes de los posts.

### Base de datos: 
MySQL.
Xampp

## ARQUITECTURA Y DISEÑO

### Frontend
El blog está compuesto por las siguientes partes:

_Componetes de página_

`pages/index.js` 
Home:
Muestra un feed de las publicaciones más recientes.
Utiliza el componente "postArticle" para renderizar cada entrada en la lista.
Cada entrada muestra una imagen, título, fecha y extracto del contenido.
Incluye un botón para agregar nuevas entradas.
Usa el paquete swr para manejar el estado global de los datos en el lado del cliente.

`pages/posts/[id].js`
Entrada Única Completa:
Permite ver una publicación completa haciendo clic en el título o la imagen en la home.
Muestra la imagen, título, fecha y contenido completo de la entrada.
Ofrece botones para editar, guardar (en modo edición) y borrar la entrada.

`pages/posts/create-new`
Página de Añadir Entrada:
Formulario para agregar nuevas entradas.
Permite cargar una imagen, ingresar título, contenido y fecha (automática).
Al guardar, se añade la entrada a la base de datos y se guarda la imagen en el servidor.

_componentes comunes_

`pages/_app.js`
Exportación predeterminada de _app.js es un componente React de nivel superior que envuelve todas las páginas de su aplicación. 
Se puede usar este componente para mantener el estado cuando se navega entre páginas o para agregar estilos globales como lo estamos. haciendo aquí.

`components/layout.js`
Proporciona una estructura básica para una aplicación de Next.js, con un encabezado, una barra de navegación, contenido principal y un pie de página. Los estilos CSS se definen en archivos separados y se importan según sea necesario aunque en gran medida usa bootstrap.

_componentes_

Se han separado componentes con funcionalidad muy marcada para aligerar el código y dividir las funcionalidades. Aún cabe refactorización pero se pueden encontrar ya en el proyecto los siguientes:

- `deleteButton` -> de uso en todos los postArticles.
- `footer` -> incluido en el layout
- `imageUploader` -> contenedor específico con la lógica de react-dropzone para la carga de imágenes. Usado en modo edición de postArticle y en newPostCard.
- `newPostCard `-> formulario para la carga de un nuevo post
- `postArticle` -> Componente reutilizado con renderización condicional en función de diferentes estados o rutas donde se encuentre, por ejemplo en la home.  Además, contiene la lógica de el `modo edición` de la entrada, que solo se activa al hacer clic en el botón editar. A través de ella podemos editar los campos que queramos (título, contenido, o imagen). Se le ha añadido al modo edición, un botón para cancelar la edición en caso de no querer continuar. 


### Backend 
El servidor es una API REST creada con Express Generator y utiliza Node.js. La estructura del backend se compone de las siguientes carpetas:

- `bin`: Contiene el archivo `www` donde se establece la configuración para la escucha del servidor en un puerto específico.
- `db`: Aquí se encuentra la conexión con la base de datos SQL mediante las dependencias `mysql2` y `mysql/promises`, creando un pool de conexiones.
- `lib`: Contiene varios archivos con funcionalidades utilizadas en diferentes partes del servidor, así como los middlewares para la verificación de datos provenientes del cliente y la autenticación.
- `routes`: Se definen las diferentes rutas del servidor utilizando `express.router()`. Cada ruta representa un apartado de la base de datos, en este caso una única; gestión de publicaciones. En los endpoints se importan controladores.
- `controllers` : Clase PostController que consta de los métodos CRUD necesarios de uso en los distintos endpoints. 
  - Los controladores han sido pensados para que, aun a pesar de ser más complejos permitan un mejor rendimiento y experiencia de usuario.Ejemplos destacados:
    -  estableciendo una sola petición que contemple distintas opciones, como en el caso de updatePost, maneja los casos de recibir todos, ninguno, o solo alguno de los datos que conforman el post, para actualizar solo aquellos deseados.
    -  Los posts se muestran por fecha de publicación siendo la primera la más reciente.
    -  Al eliminar un post, se borra su registro en la carpeta /public/images del servidor.

Todas estas rutas se importan en `app.js`, el archivo principal del servidor. También se incluyen manejadores de errores preestablecidos.


## FUNCIONALIDADES CLAVE

- Sistema CRUD: Creación, Lectura, Actualización y Borrado de entradas.
- Envío de imágenes al servidor mediante react-dropzone y almacenamiento en carpeta pública.
- Edición de entradas con renderización condicional de campos en modo edición.
- Protección contra borrado accidental mediante popup de confirmación.


## DESAFÍOS TÉCNICOS

- Elección de implementar Next.js:
  Fue un reto, ya que invertí 3 dias en identificar cómo tenía que implementar las rutas, aplicar los estilos individuales y globales de CSS ( para los que hay que utilizar modules), y sin duda entender e identificar cómo Next.js es capaz de renderizar del lado del servidor, y del lado del cliente.
  Tuve que reiniciar el proyecto 2 veces antes de dar con la tecla, y entender que conociendo React, las funcionalidades se pueden implementar, aunque usando este framework tenga buenas posibilidades para refactorizar en un futuro, y hacer la web más escalable.
  Solventé el reto a través de la documentacion oficial y motores de búsqueda basados en IA para programación.

- Manejo de imágenes en frontend y backend: Una vez conseguido el reto con estructurar Next.js, el mayor desafío técnico del proyecto fue la implementación del manejo de imágenes en el servidor tanto para la carga como para la edición de imágenes en los posts. 
Para lograrlo, se utilizó la librería multer para manejar la subida de archivos, fs para guardar la imagen en el servidor y path para gestionar las rutas adecuadamente.

- Otro reto surgido fue que en la ruta `/posts/[id]`, surgía un error al recargarse la página [react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error). Esto sucedía debido a que el contenido de la ruta dinámica se estaba renderizando inicialmente del lado del servidor, en vez de diréctamente del lado del cliente, y al recargar la página, NEXTjs sobreescribía el contenido añadiendo un escuchador del lado del cliente. 
  Para solucionarlo utilicé el paquete swr para manejar el estado global de los datos en el lado del cliente.
Utilicé la función getStaticProps para obtener los datos iniciales del servidor y pasarlos como prop a la página Home. Luego, en el componente Home, se usa useSWR con la opción initialData para cargar los datos del lado del cliente y utilizar los datos iniciales si están disponibles. Esto evitó la duplicación de datos al refrescar la página.


## Mejoras futuras: 

- Implementar autenticación de usuarios para proteger el contenido y permitir que los autores editen solo sus propias entradas.
- Mejorar el manejo de imágenes en el servidor para optimizar el rendimiento y la seguridad.
- Explorar la posibilidad de implementar un enfoque más sofisticado para el enrutamiento utilizando App router de Next.js.
- Incluir el servidor en la misma aplicación de Next.js







