package controllers

import scala.concurrent.Future

import javax.inject.Inject
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.JsString
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.api.i18n.Messages.Implicits._
import play.api.i18n.I18nSupport
import play.api.mvc.Controller

import models.repositories.ResearcherRepository
import models.repositories.RoleRepository
import vos.ResearcherVO
import play.api.i18n.MessagesApi
import models.entities.JsonMessage

class ResearcherController @Inject()(
    researcherRepo: ResearcherRepository,
    auth: SecuredAuthenticator,
    implicit val messagesApi: MessagesApi
    
  ) extends Controller with I18nSupport {

  def getAll = auth.JWTAuthentication.async {
    val researchers = researcherRepo.listAll
    researchers.map(researcherList => {
      Ok(Json.toJson(
        researcherList.map(r => {
          ResearcherVO.fromResearcherUser(r)
        })))
    })
  }

  def get(id: Long) = auth.JWTAuthentication.async {
    val researcher = researcherRepo.get(id)

    researcher.map(r => {
      Ok(Json.toJson(ResearcherVO.fromResearcherUser(r.get)))
    })
  }

  def add = auth.JWTAuthentication.async { implicit request =>
    ResearcherVO.researcherVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO((errorForm.errorsAsJson))))
      },
      data => {
        researcherRepo.save(ResearcherVO.toResearcherUser(data))
          .map(r => Ok(JsonMessage.resOK(JsString("Investigador creado: " + Json.toJson(r)))))
          .recover {
            case e => Ok(JsonMessage.resKO(JsString(e.getMessage)))
        }
    })
  }
  
  def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    ResearcherVO.researcherVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson)))
      },
      data => {
        if (id == 1 && (!data.access  || !data.admin)) Future.successful(BadRequest(JsonMessage.resKO("No está permitido eliminar los permisos de administración de este investigador.")))
        else {
          researcherRepo.update(ResearcherVO.toResearcherUser(data))
            .map(p => { Ok(JsonMessage.resOK(JsString("Investigador actualizado."))) })
            .recover{ case e => { Ok(JsonMessage.resKO(JsString(e.getMessage)))} }
        }
      }
    )
  }
  
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    if (id == 1) Future.successful(BadRequest(JsonMessage.resKO("No está permitido eliminar este investigador. El primer investigador de la aplicación puede editarse, no elminarse.")))
    else researcherRepo.delete(id).map(x => Ok(JsonMessage.resOK("Investigador eliminado"))).recover { case e => Ok(JsonMessage.resKO(JsString(e.getMessage))) }
  }
}