# Research Group Manager

Como trabajo fin de grado se realiza una aplicación web destinada a la gestión de un grupo de investigación y realizada en Scala. Esta aplicación permitirá la gestión de investigadores, publicaciones y calendarios del grupo.

## Estado

El proyecto se encuentra en la etapa inicial de su desarrollo.

### Requisitos

1. Instalar SBT o Activator y añadirlo al PATH.
2. Instalación de Play 2.5.
3. Instalación de un IDE. Para el desarrollo se ha utilizado Scala IDE (Eclipse + plugin de Scala).
4. Descargar e instalar el gestor de paquetes NPM.
5. Instalar Webpack de forma global con NPM: npm install webpack -g
6. Copiar el fichero git-hooks/pre-push en .git/hooks. Puede hacerse a mano o ejecutando el comando "sbt run" desde la carpeta "git-hooks".
7. (OPCIONAL) Instalar NodeJS para poder iniciar un servidor que recargue la página automáticamente con cada cambio.

Está pendiente de dar en este README información adicional sobre las versiones mínimas de algunas de las tecnologías anteriores.

### Ejecución

Primero, realizaremos la compilación de los ficheros de la vista. Abrir un terminal y ejecutar el siguiente comando:

```
npm run compile
```

Posteriormente ejecutamos el servidor web de la aplicación en localhost:9000:

```
sbt run
```

Si se desea recompilar los ficheros de la vista con cada cambio puede abrirse un nuevo terminal y ejecutar lo siguiente:

```
npm run watch
```

Esto, si se dispone de NodeJS instalado, iniciará también un servidor web y abrirá un navegador en localhost:9001 el cuál se recargará automáticamente con cada cambio.

## Posibles problemas

```
ENOENT: no such file or directory, scandir ".../node_modules/node-sass/vendor"
```

En caso de encontrarte con este error ejecutar:

```
npm rebuild node-sass
```

Con esto debería funcionar correctamente.


## Frameworks

* [Play Framework 2.5](https://www.playframework.com/) - Framework web
* [Slick](http://slick.lightbend.com/) - Acceso a datos

## Gestión de dependencias

* [SBT](http://www.scala-sbt.org/)
* [NPM](https://www.npmjs.com/)

## Librerías y utilidades principales
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [React router](https://github.com/ReactTraining/react-router/)
* [Webpack](https://webpack.js.org/)
* [Bootstrap](http://getbootstrap.com/)
* [SASS](http://sass-lang.com/)
* [Redux Form](http://redux-form.com)
* [Babel](https://babeljs.io/)

## Librerías y utilidades secundarias
* [BrowserSync](https://browsersync.io/)
* [ESLint](http://eslint.org/)
* [jQuery](https://jquery.com/)
* [Font Awesome](http://fontawesome.io/)
* [React Select](http://jedwatson.github.io/react-select/)
* [Redux Thunk](https://github.com/gaearon/redux-thunk)
* [React big calendar](http://intljusticemission.github.io/react-big-calendar/examples/index.html)
* [Redux datepicker](https://hacker0x01.github.io/react-datepicker/)
* [Moment](https://momentjs.com/)
* [Pre-commit](https://github.com/nlf/precommit-hook)
