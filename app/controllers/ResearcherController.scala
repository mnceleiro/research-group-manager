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
  
  def getAll = Action.async {
    val researchers = researcherService.listAll
    researchers.map(r => Ok(Json.toJson(r)))
  }
  
  def get(id: Int) = Action.async {
    val researcher = researcherService.get(id)
    researcher.map(r => Ok(Json.toJson(r)))
  }
  
  def add = Action { implicit request => 
      val x = Researcher.researcherForm.bindFromRequest.fold(
        errorForm => Future.failed(new Exception),
        data => {
          researcherService.save(data)
        }
      )
    println(x.value.get)
    NoContent
  }
  
  def update = Action { implicit request =>
    val x = Researcher.researcherForm.bindFromRequest.fold(
      errorForm => Future.failed(new Exception),
      data => {
        researcherService.update(data)
      }
    )
    println(x)
    NoContent
  }
}