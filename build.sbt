name := """Research Group Manager"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.8"


libraryDependencies += jdbc
libraryDependencies += cache
libraryDependencies += ws
libraryDependencies += evolutions
libraryDependencies += "org.webjars" %% "webjars-play" % "2.5.0"
libraryDependencies += "org.webjars" % "jquery" % "3.1.1-1"
;libraryDependencies += "org.webjars" % "bootstrap" % "3.3.7-1" exclude("org.webjars", "jquery")
libraryDependencies += "org.webjars" % "bootstrap-sass" % "3.3.7" exclude("org.webjars", "jquery")
libraryDependencies += "org.webjars.bower" % "compass-mixins" % "0.12.10"
libraryDependencies += "org.webjars" % "font-awesome" % "4.7.0"
libraryDependencies += "org.webjars" % "requirejs" % "2.3.2" exclude("org.webjars", "jquery")
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test
libraryDependencies += "com.h2database" % "h2" % "1.4.193"
