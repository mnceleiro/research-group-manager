package controllers

import scala.concurrent.Await
import scala.concurrent.Future
import scala.concurrent.duration._

import play.api.i18n.Messages.Implicits._
import javax.inject._
import play.api._
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json._
import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._

import services.ResearcherService
import models.entities.Researcher
import scala.util.Success
import scala.util.Failure
import utils.Password

class ResearcherController @Inject()(
    researcherService: ResearcherService,
    auth: SecuredAuthenticator
    ) extends Controller {
  implicit val userWrites = Json.writes[Researcher]
  implicit val userReads = Json.reads[Researcher]
  
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)
  
  def getAll = auth.JWTAuthentication.async {
    val researchers = researcherService.listAll
    researchers.map(r => Ok(Json.toJson(r)))
  }
  
  def get(id: Long) = auth.JWTAuthentication.async {
    val researcher = researcherService.get(id)
    researcher.map(r => Ok(Json.toJson(r)))
  }

  def add = auth.JWTAuthentication.async { implicit request =>
    Researcher.researcherForm.bindFromRequest.fold(
      errorForm => {
//        println(errorForm)
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
        researcherService.save(data.copy(password=Password.hashPassword(data.password.get)))
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
        researcherService.update(data)
          .map(p => {println("OK"); Ok(resOK(JsString("Investigador actualizado.")))})
          .recover{ case e => {println(e); Ok(resKO(JsString(e.getMessage)))} }
      }
    )
  }
  
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    researcherService.delete(id).map(x => Ok(resOK(JsString("Investigador eliminado")))).recover { case e => Ok(resKO(JsString(e.getMessage))) }
  }
}