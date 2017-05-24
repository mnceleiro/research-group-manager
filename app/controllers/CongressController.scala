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
import models.repositories.AuthorCongressRepository
import vos.AuthorOfCongressVO
import vos.ResearcherVO
import models.entities.AuthorCongress

class CongressController @Inject() (
    congressRepo: CongressRepository,
    authorCongressRepo: AuthorCongressRepository,
    auth: SecuredAuthenticator) extends Controller {

  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)

  implicit val researcherFormat = Json.format[ResearcherVO]
  implicit val researcherWrites = Json.writes[ResearcherVO]
  implicit val researcherReads = Json.reads[ResearcherVO]

  implicit val comgressWrites = Json.writes[AuthorOfCongressVO]
  implicit val comgressReads = Json.reads[AuthorOfCongressVO]
  
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
  
  def getWithAuthors(id: Long) = auth.JWTAuthentication.async {
    val promise = authorCongressRepo.getCongressWithAuthors(id)
    
    promise.map(o => {
      if (o == None) Ok(resKO(JsString("El congreso buscado no existe")))
      else {
        Ok(Json.toJson(CongressVO.toCongressVOWithAuthors(o)))
      }
    })
  }

  def add = auth.JWTAuthentication.async { implicit request =>
    CongressVO.congressVOForm.bindFromRequest.fold(
      errorForm => {
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
        val (congress , authorCongresses, authors) = CongressVO.toTuples(data) 
        authorCongressRepo.save(congress, authorCongresses, authors)
          .map(r => Ok(resOK(JsString("Congreso creado"))))
          .recover {
            case e => Ok(resKO(JsString(e.getMessage)))
          }
      })
  }
  
  def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    CongressVO.congressVOForm.bindFromRequest.fold(
      errorForm => {
        println(errorForm)
        Future.failed(new Exception)
      },
      data => {
        val (congress , authorCongresses, authors) = CongressVO.toTuples(data) 
        authorCongressRepo.update(congress, authorCongresses, authors).map(p => { println("OK"); Ok(resOK(JsString("Congreso actualizado."))) })
          .recover { case e => { println(e); Ok(resKO(JsString(e.getMessage))) } }
      })
  }

  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    println(id)
    authorCongressRepo.deleteCongress(id).map(x => Ok(resOK(JsString("Congreso eliminado")))).recover { case e => Ok(resKO(JsString(e.getMessage))) }
  }

}