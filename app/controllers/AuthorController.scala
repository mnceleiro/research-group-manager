package controllers

import com.google.inject.Inject
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

import play.api.libs.json.Json
import play.api.libs.json.JsValue
import play.api.libs.json.JsString
import scala.concurrent.Future

import models.entities.JsonMessage

import models.repositories.CongressRepository
import models.entities.Author
import models.repositories.AuthorRepository
import vos.CongressVO
import play.api.i18n.I18nSupport
import play.api.i18n.MessagesApi
import vos.AuthorVO

class AuthorController @Inject() (
    repo: AuthorRepository,
    auth: SecuredAuthenticator,
    implicit val messagesApi: MessagesApi
  ) extends Controller with I18nSupport{

  def getAll = auth.JWTAuthentication.async {
    repo.listAll.map(cs => Ok(Json.toJson(cs)))
  }
  
  def getAllComplete = auth.JWTAuthentication.async {
    repo.listAllComplete.map(cs => {
      Ok(Json.toJson(
        cs.map(x => AuthorVO.toVO(x._1, x._2))
      ))
    })
  }

  def get(id: Long) = auth.JWTAuthentication.async {
    repo.get(id).map(c => 
      Ok(Json.toJson(c))
    )
  }
  
  def getComplete(id: Long) = auth.JWTAuthentication.async {
    repo.getComplete(id).map(t => {
      val author = t.map(x => {
        AuthorVO.toVO(x._1, x._2)
      }).headOption
      
      Ok(Json.toJson(author))
    })
  }

  def add = auth.JWTAuthentication.async { implicit request =>
    Author.authorForm.bindFromRequest.fold(
      errorForm => {
        Future.apply(Ok(JsonMessage.resKO(JsString(""))))
      },
      data => {
        repo.save(data)
          .map(r => Ok(JsonMessage.resOK(JsString("Autor creado"))))
          .recover {
            case e => Ok(JsonMessage.resKO(JsString(e.getMessage)))
          }
      })
  }

  def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    Author.authorForm.bindFromRequest.fold(
      errorForm => Future.failed(new Exception),

      data => {
        repo.update(data)
          .map(p => { Ok(JsonMessage.resOK(JsString("Autor actualizado."))) })
          .recover { case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) } }
      })
  }

  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    repo.delete(id).map(x => {
      Ok(JsonMessage.resOK(JsString("Autor eliminado")))
    }).recover { 
      case e => {
        Ok(JsonMessage.resKO(JsString(e.getMessage)))
      }
    }
  }

}