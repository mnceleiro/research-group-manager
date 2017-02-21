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

class ResearcherController @Inject()(
    researcherService: ResearcherService
    ) extends Controller {
  implicit val userWrites = Json.writes[Researcher]
  implicit val userReads = Json.reads[Researcher]
  
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)
  
  def getAll = Action.async {
    val researchers = researcherService.listAll
    researchers.map(r => Ok(Json.toJson(r)))
  }
  
  def get(id: Long) = Action.async {
    val researcher = researcherService.get(id)
    researcher.map(r => Ok(Json.toJson(r)))
  }

  def add = Action.async { implicit request =>
    println("hola")
    Researcher.researcherForm.bindFromRequest.fold(
      errorForm => Future.apply(Ok(resKO(JsString("")))),
      data => {
        researcherService.save(data)
          .map(r => Ok(resOK(JsString("Investigador creado"))))
          .recover {
            case e => Ok(resKO(JsString(e.getMessage)))
          }
      })
  }
  
  def update(id: Long) = Action { implicit request =>
    val x = Researcher.researcherForm.bindFromRequest.fold(
      errorForm => Future.failed(new Exception),
      data => {
        researcherService.update(data)
          .map(p => Ok(resOK(JsString("Investigador actualizado."))))
          .recover{ case e => Ok(resKO(JsString(e.getMessage))) }
      }
    )
    
    println(x)
    NoContent
  }
  
  def delete(id: Long) = Action.async { implicit request =>
    researcherService.delete(id).map(x => Ok(resOK(JsString("")))).recover { case e => Ok(resKO(JsString(""))) }
  }
}