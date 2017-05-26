package controllers

import scala.inline
import org.omg.CosNaming.NamingContextPackage.NotFound
import akka.event.slf4j.Logger
import java.io.File
import play.api.mvc.Controller
import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.Play
import com.google.inject.Inject
import controllers.Assets.Asset

class AssetsController @Inject() extends Controller {
  val AbsolutePath = """^(/|[a-zA-Z]:\\).*""".r

  def at(rootPath: String, file: Asset): Action[AnyContent] = Action { request =>
    val fileToServe = rootPath match {
      case _ => new File(Play.application.getFile(rootPath), file.name)
    }

    if (fileToServe.exists) {
      Ok.sendFile(fileToServe, inline = true)
    } else {
      NotFound
    }
  }

  def index(rootPath: String, file: Asset): Action[AnyContent] = Action { request =>
    val fileToServe = rootPath match {
      case _ => new File(Play.application.getFile(rootPath), "index.html")
    }

    if (fileToServe.exists) {
      Ok.sendFile(fileToServe, inline = true)
    } else {
      NotFound
    }
  }

}