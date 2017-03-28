name := """Research Group Manager"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

PlayKeys.playRunHooks += Webpack(baseDirectory.value)

fork in run := false

scalaVersion := "2.11.8"

libraryDependencies += "com.h2database" % "h2" % "1.4.193"
libraryDependencies += "com.typesafe.play" %% "play-slick" % "2.0.2"
libraryDependencies += "com.typesafe.play" %% "play-slick-evolutions" % "2.0.2"
libraryDependencies += cache
libraryDependencies += ws
libraryDependencies += evolutions
libraryDependencies += "com.github.t3hnar" %% "scala-bcrypt" % "3.0"
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test