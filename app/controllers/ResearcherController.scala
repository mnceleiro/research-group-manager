package controllers

import scala.concurrent.Await
import scala.concurrent.Future
import scala.concurrent.duration._

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
  
  def addOrUpdate = Action { implicit request => 
    implicit val userReads = Json.reads[Researcher]
    
    // TODO: Mejorar el codigo de conversion de JSON a objetos
    val jsonObject = request.body.asJson
    val res: Researcher = Json.fromJson[Researcher](jsonObject.get).get
    if (res.id <= 0) researcherService.save(res)
    else researcherService.update(res)
    
    Ok("OK")
  }
}