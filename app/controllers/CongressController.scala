package controllers

import com.google.inject.Inject
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

import play.api.libs.json.Json
import play.api.libs.json.JsValue
import play.api.libs.json.JsString
import scala.concurrent.Future

import models.entities.Congress
import models.repositories.CongressRepository
import vos.CongressVO
import models.entities.Author

class CongressController @Inject() (
    congressRepo: CongressRepository,
    auth: SecuredAuthenticator) extends Controller {

  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)

  implicit val comgressWrites = Json.writes[Congress]
  implicit val comgressReads = Json.reads[Congress]
  
  implicit var authorReads = Json.reads[Author]
  implicit var authorWrites = Json.writes[Author]
  implicit var authorFormat = Json.format[Author]
  
  implicit var congressFormatVO = Json.format[CongressVO]
  implicit val comgressVOWrites = Json.writes[CongressVO]
  implicit val comgressVOReads = Json.reads[CongressVO]

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

  def add = auth.JWTAuthentication.async { implicit request =>
    CongressVO.congressVOForm.bindFromRequest.fold(
      errorForm => {
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
        congressRepo.save(CongressVO.fromVO(data))
          .map(r => Ok(resOK(JsString("Congreso creado"))))
          .recover {
            case e => Ok(resKO(JsString(e.getMessage)))
          }
      })
  }

  def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    CongressVO.congressVOForm.bindFromRequest.fold(
      errorForm => Future.failed(new Exception),

      data => {
        congressRepo.update(CongressVO.fromVO(data))
          .map(p => { println("OK"); Ok(resOK(JsString("Congreso actualizado."))) })
          .recover { case e => { println(e); Ok(resKO(JsString(e.getMessage))) } }
      })
  }

  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    congressRepo.delete(id).map(x => Ok(resOK(JsString("Congreso eliminado")))).recover { case e => Ok(resKO(JsString(e.getMessage))) }
  }

}