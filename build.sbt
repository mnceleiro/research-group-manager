name := """ResearchGroupManager"""
version := "1.0"

import com.typesafe.sbt.SbtNativePackager.autoImport.NativePackagerHelper._
import com.typesafe.sbt.packager.archetypes.ServerLoader

mappings in Universal ++= directory(baseDirectory.value / "public")

lazy val root = (project in file(".")).enablePlugins(PlayScala, DebianPlugin)
maintainer in Linux := "Marcos Nunez <mnceleiro@esei.uvigo.es>"
packageSummary in Linux := "Research Group Manager application"
packageDescription := "Research Group Manager application"

PlayKeys.playRunHooks += Webpack(baseDirectory.value)

fork in run := false

scalaVersion := "2.11.8"

serverLoading in Debian := ServerLoader.Systemd

javaOptions in Universal ++= Seq(
  "-J-Xmx1024m",
  "-J-Xms512m",
  s"-Dpidfile.path=/dev/null",
  s"-Dconfig.file=/usr/share/${packageName.value}/conf/prod.conf",
  s"-Dhttp.port=8008"
)


resolvers ++= Seq("snapshots", "releases").map(Resolver.sonatypeRepo)

;libraryDependencies += "com.h2database" % "h2" % "1.4.193"
libraryDependencies += "mysql" % "mysql-connector-java" % "5.1.42"
libraryDependencies += "com.typesafe.play" %% "play-slick" % "2.0.2"
libraryDependencies += "com.typesafe.play" %% "play-slick-evolutions" % "2.0.2"
libraryDependencies += cache
libraryDependencies += ws
libraryDependencies += evolutions
libraryDependencies += "com.github.t3hnar" %% "scala-bcrypt" % "3.0"
libraryDependencies += "com.jason-goodwin" %% "authentikat-jwt" % "0.4.5"
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test