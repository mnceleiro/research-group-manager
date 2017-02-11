# Research Group Manager

Aplicación web destinada a la gestión de un grupo de investigación y realizada en Scala. Esta aplicación permitirá la gestión de investigadores, publicaciones y calendarios del grupo.

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

Una vez cumplidos los requisitos anteriores, abrir un terminal, situarse en el directorio del proyecto y ejecutar el siguiente comando:

```
sbt run
```

Opcionalmente se puede ejecutar también el siguiente comando en otro terminal (Es necesario tener instalado NodeJS):
```
npm run watch
```

Se iniciará otro servidor web y abrirá el navegador en localhost:9001 utilizando browsersync para recargar automáticamente la página con cada cambio. En caso de no ejecutar este último comando se deberá acceder a la aplicación web desde localhost:9000.

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

* [SBT] (http://www.scala-sbt.org/)
* [NPM] (https://www.npmjs.com/)

## Módulos & Librerias

* [React] (https://facebook.github.io/react/)
* [Webpack] (https://webpack.js.org/)
* [Babel] (https://babeljs.io/)
* [BrowserSync] (https://browsersync.io/)
* [ESLint](http://eslint.org/)
* [SASS] (http://sass-lang.com/)
* [jQuery] (https://jquery.com/)
* [Bootstrap] (http://getbootstrap.com/)
* [Font Awesome] (http://fontawesome.io/)
