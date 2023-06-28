/**
 * exportación predeterminada de _app.js es un componente React de nivel superior 
 * que envuelve todas las páginas de su aplicación. 
 * Se puede usar este componente para mantener el estado cuando se navega entre 
 * páginas o para agregar estilos globales como lo estamos haciendo aquí.
*/

import '../styles/global.css';

export default function App({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
