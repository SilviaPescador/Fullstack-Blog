-- ============================================
-- SEED: Insertar posts originales
-- IMPORTANTE: Reemplaza 'TU_USER_ID_AQUI' con tu ID de usuario de Supabase
-- Lo encuentras en: Table Editor → profiles → columna "id"
-- ============================================

-- Primero, define tu user_id
DO $$
DECLARE
    my_user_id UUID := 'TU_USER_ID_AQUI'; -- ← REEMPLAZA ESTO
BEGIN

-- Post 1: La importancia de la IA
INSERT INTO posts (title, content, image_url, author_id, created_at) VALUES (
    'La importancia de la IA en tiempos modernos.',
    'En la era digital en la que vivimos, la tecnología ha avanzado a pasos agigantados, y la Inteligencia Artificial (IA) ha emergido como una de las tecnologías más transformadoras. La IA es la simulación de procesos de inteligencia humana mediante máquinas, permitiéndoles aprender, razonar y tomar decisiones. Su impacto en nuestra sociedad y economía ha sido profundo, y su relevancia continúa creciendo día a día. En esta entrada, exploraremos por qué la Inteligencia Artificial es tan importante en el mundo actual.

1. Automatización y Eficiencia

Una de las ventajas más destacadas de la IA es su capacidad para automatizar tareas repetitivas y tediosas que antes requerían la intervención humana. Esto ha liberado a las personas de trabajos monótonos, permitiéndoles centrarse en tareas más creativas y estratégicas. La automatización impulsada por la IA también ha mejorado la eficiencia en diversas industrias, desde la fabricación hasta la atención al cliente.

2. Avances en la Medicina

La IA ha demostrado un potencial revolucionario en el campo de la medicina. Los algoritmos de aprendizaje automático pueden analizar grandes conjuntos de datos médicos para detectar patrones y diagnosticar enfermedades con mayor precisión. Además, la IA se está utilizando en el desarrollo de medicamentos y en la investigación genética para abordar enfermedades incurables y mejorar la calidad de vida de las personas.

3. Personalización y Experiencia del Cliente

La IA ha cambiado la forma en que las empresas interactúan con sus clientes. Mediante el análisis de datos y el aprendizaje automático, las empresas pueden personalizar las experiencias de sus clientes, ofreciéndoles productos y servicios más relevantes y adaptados a sus necesidades. Esto ha llevado a una mayor satisfacción del cliente y a un aumento en la lealtad a la marca.

4. Conducción Autónoma

Otro campo en el que la IA ha dejado una huella significativa es en la conducción autónoma. Los vehículos autónomos utilizan sistemas de visión por computadora y algoritmos de IA para navegar de manera segura y eficiente. Esta tecnología tiene el potencial de reducir los accidentes de tráfico y mejorar la movilidad de las personas, al tiempo que disminuye la contaminación.

5. Resolución de Problemas Globales

La IA también se ha utilizado para abordar desafíos globales, como el cambio climático, la gestión de recursos naturales y la predicción de catástrofes naturales. Los modelos de IA pueden analizar datos ambientales y climáticos para proporcionar información crucial para la toma de decisiones en la lucha contra el cambio climático y la protección del medio ambiente.

6. Avances en la Investigación Científica

En el ámbito de la investigación científica, la IA ha demostrado ser una herramienta invaluable. Los científicos pueden utilizar la IA para procesar grandes volúmenes de datos, acelerar el descubrimiento de nuevos medicamentos, predecir resultados experimentales y desarrollar modelos complejos para entender mejor el universo y la naturaleza.

Conclusión

La Inteligencia Artificial ha cambiado la forma en que vivimos y trabajamos. Su capacidad para automatizar tareas, mejorar la toma de decisiones y resolver problemas complejos ha demostrado ser de gran valor en diversas áreas de la sociedad. Sin embargo, también es importante abordar los desafíos éticos y de privacidad que surgen con el uso de la IA. A medida que esta tecnología continúa avanzando, es fundamental que la utilicemos de manera responsable y ética para garantizar un futuro mejor para todos.',
    NULL,
    my_user_id,
    '2023-06-30 18:56:44'
);

-- Post 2: De Comercial a Programadora
INSERT INTO posts (title, content, image_url, author_id, created_at) VALUES (
    'De Comercial a Programadora: La Importancia del Enfoque y la Motivación en la Transformación Profesional',
    'Introducción

Durante toda mi vida, me he dedicado al apasionante mundo comercial, donde he aprendido a cerrar tratos, conquistar clientes y alcanzar objetivos. Sin embargo, últimamente, he sentido el deseo de dar un giro radical en mi carrera profesional y adentrarme en el fascinante mundo de la programación. Aunque el camino no es fácil y enfrento desafíos constantes, he descubierto que el enfoque y la motivación son fundamentales para alcanzar mis nuevos objetivos como programadora.

1. Definiendo el Objetivo

El primer paso en mi transformación profesional fue definir claramente mi objetivo: convertirme en una programadora competente. Esta meta fue el faro que me guiaría en cada paso del camino. Tener un objetivo claro y específico me permitió trazar un plan de acción y establecer metas a corto, mediano y largo plazo.

2. Aprendizaje Continuo

Al sumergirme en el mundo de la programación, rápidamente me di cuenta de que el aprendizaje es un proceso continuo y en constante evolución. La tecnología avanza rápidamente, y es esencial mantenerme actualizada con las últimas tendencias y herramientas.

3. Superando los Obstáculos

El camino hacia la reskilling no ha estado exento de obstáculos. A menudo, me encuentro con desafíos técnicos y momentos de frustración que me hacen cuestionar si estoy tomando la decisión correcta. Sin embargo, el enfoque en mi objetivo y la motivación intrínseca de querer lograrlo me han permitido superar esos obstáculos.

4. Manteniendo la Pasión

Como comercial, siempre fui apasionada en lo que hacía, y llevar esa pasión al mundo de la programación ha sido clave. La pasión me impulsa a sumergirme en proyectos personales, a investigar nuevas tecnologías y a participar en comunidades de programadores.

5. Celebrando los Logros

A lo largo de mi proceso de reskilling, aprendí la importancia de celebrar los logros, por pequeños que sean. Cada nueva línea de código escrita, cada concepto comprendido y cada proyecto terminado son motivos para celebrar.

Conclusión

Mi transición del mundo comercial al de la programación ha sido un emocionante viaje de autodescubrimiento y crecimiento profesional. A través de esta experiencia, he aprendido que el enfoque y la motivación son los pilares fundamentales para alcanzar cualquier objetivo.',
    NULL,
    my_user_id,
    '2023-06-30 19:30:24'
);

-- Post 3: Blog Fullstack con Express y Next.js
INSERT INTO posts (title, content, image_url, author_id, created_at) VALUES (
    'Construyendo un Blog Fullstack con Express y Next.js: Un Mundo de Posibilidades',
    'Introducción

El mundo del desarrollo web está en constante evolución, y la combinación de Express en el backend y Next.js en el frontend se ha convertido en una poderosa opción para construir aplicaciones web fullstack. En esta entrada, exploraremos el emocionante proceso de creación de un blog fullstack utilizando estas tecnologías.

1. Express en el Backend

Express es un framework de desarrollo web para Node.js que se destaca por su simplicidad y flexibilidad. En el backend de nuestro blog, utilizaremos Express para manejar las rutas, definir los endpoints de la API y gestionar las solicitudes del cliente.

2. Next.js en el Frontend

Next.js es una tecnología nueva y emocionante que se ha vuelto muy popular en la comunidad de desarrollo web. Es un framework de React que permite crear aplicaciones frontend de forma rápida y sencilla.

3. Configuración del Proyecto

Antes de sumergirnos en la construcción del blog, es importante configurar nuestro proyecto. Utilizaremos Node.js y npm para manejar las dependencias y scripts del proyecto.

4. Diseño y Componentes

Una vez configurado el proyecto, es hora de diseñar la interfaz de usuario y crear los componentes del frontend. Next.js permite organizar nuestros componentes de manera intuitiva y modular.

5. Construcción de la API

Con Express en el backend, construiremos nuestra API para gestionar las operaciones CRUD de nuestro blog.

Conclusión

La combinación de Express en el backend y Next.js en el frontend abre un mundo de posibilidades para construir aplicaciones web fullstack modernas y eficientes.',
    NULL,
    my_user_id,
    '2023-06-30 19:37:34'
);

-- Post 4: Entrada de prueba
INSERT INTO posts (title, content, image_url, author_id, created_at) VALUES (
    'Úsame como entrada de prueba',
    'Puedes comprobar todas las funcionalidades con las que cuenta este blog, básicamente un CRUD de las publicaciones (create, read, update, y delete).

Todas las imágenes de las publicaciones de este blog, han sido creadas con el Image Creator de Bing. Al crear una publicación, tenemos un enlace en el icono de microsoft arriba, que nos redirige a la página para poder crear lo que imaginemos, y acompañar a nuestras ideas.',
    NULL,
    my_user_id,
    '2023-07-01 10:12:45'
);

-- Post 5: Conxuru de San Xuan
INSERT INTO posts (title, content, image_url, author_id, created_at) VALUES (
    'Conxuru de San Xuan',
    '"Nueche de San Juan, nueche de fueu,
encendemos la foguera, toos xuntos,
saltemos l''espelu, p''algamar bon xueu,
nueche mágica, bruxes y encantos.

Salta, salta foguera, esclama''l corazón,
luz purificante, lleve afuega''l carbonchu,
espanta les males, que vienen ensin razón,
magar que la nueche tien el so encantu.

Ente''l fueu y l''augua, llimpiesa y purificación,
Nueche de San Juan, poder y tradición,
Foguera que arde col so resplandor,
Borra males, traiga bendición.

Agora que les flames danzan nel aire,
pidimos deseyos, salud y fortuna,
magar que San Xuan nos quema la care,
esperamos l''añu nuevu col so luna.

Nueche de San Juan, nueche de fueu,
brillen les estrelles, lluces y fueu,
pidimos maga, amistá y amol,
conxura asturiana, espíritu y xueu."',
    NULL,
    my_user_id,
    '2023-07-01 18:07:00'
);

-- Post 6: Logo creado con IA
INSERT INTO posts (title, content, image_url, author_id, created_at) VALUES (
    'El logo de este blog fue creado con IA',
    'Prompt: Hiperrealismo, flor construida con código javascript.
Fuente: Creador de Imágenes de Bing.',
    NULL,
    my_user_id,
    '2023-07-02 21:51:04'
);

END $$;

