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

  /**
   * Generates an `Action` that serves a static resource from an external folder
   *
   * @param absoluteRootPath the root folder for searching the static resource files.
   * @param file the file part extracted from the URL
   */
  def at(rootPath: String, file: Asset): Action[AnyContent] = Action { request =>
//    println(rootPath + "/index.html")
    val fileToServe = rootPath match {
//      case AbsolutePath(_) => new File(rootPath, file)
//      case _ => new File(Play.application.getFile(rootPath), file)
//      case AbsolutePath(_) => new File(rootPath, file)
      case _ => new File(Play.application.getFile(rootPath), file.name)
    }

    if (fileToServe.exists) {
      Ok.sendFile(fileToServe, inline = true)
    } else {
//      Logger.error("Photos controller failed to serve photo: " + file)
      NotFound
    }
  }
  
    def index(rootPath: String, file: Asset): Action[AnyContent] = Action { request =>
//    println(rootPath + "/index.html")
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