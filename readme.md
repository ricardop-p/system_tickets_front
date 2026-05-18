# System Tickets Front

Proyecto frontend para la gestión de tickets de sistema. Este README contiene instrucciones básicas para instalar, ejecutar y construir la aplicación.

## Descripción

Interfaz web para crear, visualizar y gestionar tickets de incidencias. Diseñada para integrarse con un backend que expone una API REST.

## Requisitos

- Node.js (>= 14)
- npm o yarn

## Instalación

1. Clonar el repositorio

	git clone <URL_DEL_REPOSITORIO>

2. Entrar en la carpeta del proyecto

	

3. Instalar dependencias

	npm install
	# o
	yarn install

## Ejecución en desarrollo

	npm start
	# o
	yarn start

La aplicación quedará disponible en http://localhost:3000 (o el puerto configurado).

## Build para producción

	npm run build
	# o
	yarn build

Los archivos finales se generarán en la carpeta `build` o `dist` según la configuración del proyecto.

## Variables de entorno

Configurar la URL del backend y otras variables según el archivo de ejemplo `.env.example` (si existe):

```
REACT_APP_API_URL=https://api.tuservidor.com
```

## Tecnologías

- VUE
- boostrap

