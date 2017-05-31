package controllers

import com.google.inject.Inject
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

import play.api.libs.json.Json
import play.api.libs.json.JsValue
import play.api.libs.json.JsString
import scala.concurrent.Future

import models.entities.JsonMessage

import models.entities.Congress
import models.repositories.CongressRepository
import vos.CongressVO
import models.entities.Author
import models.repositories.AuthorCongressRepository
import vos.AuthorOfCongressVO
import vos.ResearcherVO
import models.entities.AuthorCongress
import play.api.i18n.MessagesApi
import play.api.i18n.I18nSupport
import models.entities.User

class CongressController @Inject() (
    congressRepo: CongressRepository,
    authorCongressRepo: AuthorCongressRepository,
    implicit val messagesApi: MessagesApi,
    auth: SecuredAuthenticator) extends Controller with I18nSupport {

  def getAll = auth.JWTAuthentication.async {
    congressRepo.listAll.map(cs => Ok(Json.toJson(cs.map(c => {
      CongressVO.toVO(c)
    }))))
  }

  def get(id: Long) = auth.JWTAuthentication.async {
    congressRepo.get(id).map(c => 
      Ok(Json.toJson(CongressVO.toVO(
          c.getOrElse(throw new Exception("No encontrado"))
      )))
    )
  }
  
  def getWithAuthors(id: Long) = auth.JWTAuthentication.async {
    val promise = authorCongressRepo.getCongress(id)
    
    promise.map(o => {
      if (o == None) Ok(JsonMessage.resKO(JsString("El congreso buscado no existe")))
      else {
        Ok(Json.toJson(CongressVO.toCongressVOWithAuthors(o)))
      }
    })
  }

  def add = auth.JWTAuthentication.async { implicit request =>
    CongressVO.congressVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson)))
      },
      data => {
        val (congress , authorCongresses, authors) = CongressVO.toTuples(data) 
        authorCongressRepo.saveCongress(congress, authorCongresses, authors)
          .map(r => Ok(JsonMessage.resOK(JsString("Congreso creado"))))
          .recover {
            case e => Ok(JsonMessage.resKO(JsString(e.getMessage)))
          }
      })
  }
  
  def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    CongressVO.congressVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson)))
      },
      data => {
        val (congress , authorCongresses, authors) = CongressVO.toTuples(data) 
        authorCongressRepo.updateCongress(congress, authorCongresses, authors).map(p => { Ok(JsonMessage.resOK(JsString("Congreso actualizado."))) })
          .recover { case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) } }
      })
  }

  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    authorCongressRepo.deleteCongress(id).map(x => Ok(JsonMessage.resOK(JsString("Congreso eliminado")))).recover { case e => Ok(JsonMessage.resKO(JsString(e.getMessage))) }
  }

}