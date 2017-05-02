package controllers

import scala.concurrent.Future

import javax.inject.Inject
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.JsString
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.api.mvc.Controller
import utils.Password
import models.repositories.ResearcherRepository
import models.repositories.RoleRepository
import models.repositories.ResearcherRepository
import models.entities.Researcher
import models.entities.ResearcherWithUser
import models.entities.User
import vos.ResearcherVO

class ResearcherController @Inject()(
    researcherRepo: ResearcherRepository,
    auth: SecuredAuthenticator
    ) extends Controller {
  
  implicit val userWrites = Json.writes[Researcher]
  implicit val userReads = Json.reads[Researcher]
  implicit val userResFormat = Json.format[User]
  implicit val userResWrites = Json.writes[ResearcherWithUser]
  implicit val userResReads = Json.reads[ResearcherWithUser]
  implicit val resVOWrites = Json.writes[ResearcherVO]
  implicit val resVOReads = Json.reads[ResearcherVO]
  
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)

  def getAll = auth.JWTAuthentication.async {
    val researchers = researcherRepo.listAll
    researchers.map(researcherList => {
      Ok(Json.toJson(
        researcherList.map(r => {
//          println(r)
          ResearcherVO.fromResearcherUser(r)
        })))
    })
  }

  //  def getUserRoles = auth.JWTAuthentication.async {
  //    val roles = rolesService.listAll
  //    roles.map(r => {
  //      Ok(Json.toJson(r))
  //    })
  //  }

  def get(id: Long) = auth.JWTAuthentication.async {
    val researcher = researcherRepo.get(id)

    researcher.map(r => {
      println(Json.toJson(ResearcherVO.fromResearcherUser(r.get)))
      Ok(Json.toJson(ResearcherVO.fromResearcherUser(r.get)))
    })
  }

  def add = auth.JWTAuthentication.async { implicit request =>
    ResearcherVO.researcherForm.bindFromRequest.fold(
      errorForm => {
        println(errorForm)
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
        println(ResearcherVO.toResearcherUser(data))
        researcherRepo.save(ResearcherVO.toResearcherUser(data))
          .map(r => Ok(resOK(JsString("Investigador creado"))))
          .recover {
            case e => Ok(resKO(JsString(e.getMessage)))
        }
    })
  }
  
  def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    Researcher.researcherForm.bindFromRequest.fold(
      errorForm => Future.failed(new Exception),
//      errorForm => Future.apply(Ok(resKO(JsString("")))),
      
      data => {
//        println(data)
        researcherRepo.update(data)
          .map(p => {println("OK"); Ok(resOK(JsString("Investigador actualizado.")))})
          .recover{ case e => {println(e); Ok(resKO(JsString(e.getMessage)))} }
      }
    )
  }
  
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    researcherRepo.delete(id).map(x => Ok(resOK(JsString("Investigador eliminado")))).recover { case e => Ok(resKO(JsString(e.getMessage))) }
  }
}