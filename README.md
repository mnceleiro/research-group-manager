# Research Group Manager

Como trabajo fin de grado se realiza una aplicación web destinada a la gestión de un grupo de investigación y realizada en Scala. Esta aplicación permitirá la gestión de investigadores, publicaciones y calendarios del grupo.

## Estado

El proyecto se encuentra casi finalizado.

### Requisitos

1. Instalar SBT o Activator y añadirlo al PATH.
2. Instalación de Play 2.5.
3. Instalación de un IDE. Para el desarrollo se ha utilizado Scala IDE (Eclipse + plugin de Scala) y Atom para la edición en la vista.
4. Descargar e instalar el gestor de paquetes NPM.
5. Instalar Webpack de forma global con NPM: npm install webpack -g
6. Copiar el fichero git-hooks/pre-push en .git/hooks. Puede hacerse a mano o ejecutando el comando "sbt run" desde la carpeta "git-hooks".
7. (OPCIONAL) Instalar NodeJS para poder iniciar un servidor que recargue la página automáticamente con cada cambio.

### Ejecución

Primero, realizaremos la compilación de los ficheros de la vista. Abrir un terminal y ejecutar el siguiente comando:

```
npm run build:dev
```

Posteriormente ejecutamos el servidor web de la aplicación en localhost:9000:

```
sbt run "-Dconfig.resource=test.conf"
```

Con este último comando se iniciará la aplicación utilizando como gestor de BBDD H2. Si deseas usar MySQL debes tener un servidor instalado y ejecutar el script situado en scripts/create_databases.sql. No ejecutar el de creación de tablas, ya que estas se crearán automaticamente en local y desarrollo con evolutions. Para ejecutar la aplicación en local con mysql basta con escribir la siguiente línea:

```
sbt run
```

Si se desean recompilar los ficheros de la vista con cada cambio puede abrirse un nuevo terminal y ejecutar lo siguiente:

```
npm run watch:dev
```

NOTA: El primer usuario de la aplicación (de ID 1) no se puede eliminar ni se le puede quitar el acceso o los permisos de admin. Si se desea se pueden cambiar todos sus datos para convertirlo en el administrador real de la aplicación.

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


## Frameworks y librerías servidor

* [Play Framework 2.5](https://www.playframework.com/)
* [Slick](http://slick.lightbend.com/)
* [Evolutions](https://www.playframework.com/documentation/2.5.x/Evolutions)
* [Scala BCrypt](https://github.com/t3hnar/scala-bcrypt) 
* [AuthentikatJWT](https://github.com/jasongoodwin/authentikat-jwt)
* [ScalaTest](http://www.scalatest.org/)

## Gestión de dependencias

* [SBT](http://www.scala-sbt.org/)
* [NPM](https://www.npmjs.com/)

## Librerías y utilidades cliente
* [Webpack](https://webpack.js.org/)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [React router](https://github.com/ReactTraining/react-router/)
* [Bootstrap](http://getbootstrap.com/)
* [SASS](http://sass-lang.com/)
* [Redux Form](http://redux-form.com)
* [Babel](https://babeljs.io/)
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
