import org.irundaia.sbt.sass._

name := """Research Group Manager"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.8"

SassKeys.syntaxDetection := ForceScss
JsEngineKeys.engineType := JsEngineKeys.EngineType.Node

libraryDependencies += "com.h2database" % "h2" % "1.4.193"
libraryDependencies += "com.typesafe.play" %% "play-slick" % "2.0.2"
libraryDependencies += "com.typesafe.play" %% "play-slick-evolutions" % "2.0.2"
libraryDependencies += cache
libraryDependencies += ws
libraryDependencies += evolutions
libraryDependencies += "org.webjars" %% "webjars-play" % "2.5.0"
libraryDependencies += "org.webjars" % "jquery" % "3.1.1-1"
libraryDependencies += "org.webjars" % "bootstrap-sass" % "3.3.7" exclude("org.webjars", "jquery")
libraryDependencies += "org.webjars.bower" % "compass-mixins" % "0.12.10"
libraryDependencies += "org.webjars" % "font-awesome" % "4.7.0"
libraryDependencies += "org.webjars" % "requirejs" % "2.3.2" exclude("org.webjars", "jquery")
libraryDependencies += "org.webjars" % "react" % "15.3.2"
libraryDependencies += "org.webjars.bower" % "react-router" % "4.0.0-2"
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test

