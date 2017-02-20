package controllers

import scala.concurrent.Await
import scala.concurrent.Future
import scala.concurrent.duration._

import play.api.i18n.Messages.Implicits._
import javax.inject._
import models.entities.Researcher
import play.api._
import play.api.data.Forms._
import play.api.db.slick.DatabaseConfigProvider
import play.api.libs.json._
import play.api.mvc._
import services.ResearcherService

class ResearcherController @Inject()(researcherService: ResearcherService) extends Controller {
  def getAll = Action {
    val researchers = researcherService.listAll
    implicit val userWrites = Json.writes[Researcher]
    val userList = Await.result(researchers, 3 second)
    
    Ok(Json.toJson(userList))
  }
  
  def get(id: Int) = Action {
    val researcher = researcherService.get(id)
    implicit val userWrites = Json.writes[Researcher]
    val researcherResult = Await.result(researcher, 3 second)
    
    Ok(Json.toJson(researcherResult))
  }
  
  def add = Action { implicit request => 
    implicit val userReads = Json.reads[Researcher]
    
//    val jsonObject = request.body.asJson.get
//    val res: Researcher = Json.fromJson[Researcher](jsonObject).get
//    if (res.id <= 0) {
      Researcher.researcherForm.bindFromRequest.fold(
        errorForm => Future.failed(new Exception),
        data => {
          researcherService.save(data)
        }
      )
//    }
//    else researcherService.update(res)
    
    NoContent
  }
}