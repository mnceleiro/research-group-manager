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

class AuthorController @Inject() (
    repo: AuthorRepository,
    auth: SecuredAuthenticator) extends Controller {

  def getAll = auth.JWTAuthentication.async {
    repo.listAll.map(cs => Ok(Json.toJson(cs)))
  }

  def get(id: Long) = auth.JWTAuthentication.async {
    repo.get(id).map(c => 
      Ok(Json.toJson(c))
    )
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
          .map(p => { println("OK"); Ok(JsonMessage.resOK(JsString("Autor actualizado."))) })
          .recover { case e => { println(e); Ok(JsonMessage.resKO(JsString(e.getMessage))) } }
      })
  }

  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    repo.delete(id).map(x => Ok(JsonMessage.resOK(JsString("Autor eliminado")))).recover { case e => Ok(JsonMessage.resKO(JsString(e.getMessage))) }
  }

}