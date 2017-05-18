//package controllers
//
//import com.google.inject.Inject
//
//import play.api.mvc.Controller
//import play.api.libs.json.JsValue
//import play.api.libs.json.Json
//import play.api.libs.concurrent.Execution.Implicits.defaultContext
//
//import models.repositories.JournalRepository
//import vos.JournalVO
//import models.entities.Journal
//import play.api.libs.json.JsString
//import scala.concurrent.Future
//
//class ProjectController @Inject()(
//    mainRepo: JournalRepository,
//    auth: SecuredAuthenticator
//  ) extends Controller {
//  
//  implicit val journalWrites = Json.writes[JournalVO]
//  implicit val journalReads = Json.reads[JournalVO]
//  implicit val journalFormat = Json.format[JournalVO]
//  
//  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
//  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)
//
//  def getAll = auth.JWTAuthentication.async {
//    val projects = mainRepo.listAll
//    projects.map(projectList => {
//      Ok(Json.toJson(
//        projectList.map(p => {
//          JournalVO.toVO(p)
//        })))
//    })
//  }
//  
//  def get(id: Long) = auth.JWTAuthentication.async {
//    val projectFuture = mainRepo.get(id)
//
//    projectFuture.map(p => {
//      if (p == None) Ok(resKO(JsString("El Artículo de revista buscado no existe")))
//      else {
////        println(Json.toJson(JournalVO.toVO(p.get)))
//        Ok(Json.toJson(JournalVO.toVO(p.get)))
//      }
//    })
//  }
//  
//  def add = auth.JWTAuthentication.async { implicit request =>
//    JournalVO.JournalVOForm.bindFromRequest.fold(
//      errorForm => {
////        println(errorForm)
//        Future.apply(Ok(resKO(JsString(""))))
//      },
//      data => {
////        println("Artículo de revista a AÑADIR: " + JournalVO.toJournal(data))
//        mainRepo.save(JournalVO.toJournal(data))
//          .map(r => {
////            println(r)
//            Ok(resOK(JsString("Artículo de revista creado")))
//            
//          }).recover {
//            case e => Ok(resKO(JsString(e.getMessage)))
//          }
//    })
//  }
//  
//    def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
//    JournalVO.JournalVOForm.bindFromRequest.fold(
//      errorForm => Future.failed(new Exception),
////      errorForm => Future.apply(Ok(resKO(JsString("")))),
//      
//      data => {
////        println(data)
//        mainRepo.update(JournalVO.toJournal(data))
//          .map(p => {/*println("OK");*/ Ok(resOK(JsString("Artículo de revista actualizado.")))})
//          .recover{ case e => {
////            println(e) 
//            Ok(resKO(JsString(e.getMessage)))
//          } 
//        }
//      }
//    )
//  }
//    
//  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
//    println("deleting...")
//    mainRepo.delete(id).map(x => Ok(resOK(JsString("Artículo de revista eliminado")))).recover { case e => Ok(resKO(JsString(e.getMessage))) }
//  }
//}