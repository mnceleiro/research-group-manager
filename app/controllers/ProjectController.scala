package controllers

import com.google.inject.Inject

import play.api.mvc.Controller
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits.defaultContext

import models.repositories.ProjectRepository
import vos.ProjectVO
import models.entities.Project
import play.api.libs.json.JsString
import vos.ResearcherVO
import scala.concurrent.Future
import models.entities.AuthorProject

class ProjectController @Inject()(
    projectRepo: ProjectRepository,
    auth: SecuredAuthenticator
  ) extends Controller {
  
	implicit val projectWithAuthorsFormat = Json.format[AuthorProject]
	implicit val projectWithAuthorsWrites = Json.writes[AuthorProject]
	implicit val projectWithAuthorsReads = Json.reads[AuthorProject]
	
  implicit val projectWrites = Json.writes[ProjectVO]
//  implicit val projectReads = Json.reads[ProjectVO]
//  implicit val projectFormat = Json.format[ProjectVO]
  
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)

  def getAll = auth.JWTAuthentication.async {
    val projects = projectRepo.listAll
    projects.map(projectList => {
      Ok(Json.toJson(
        projectList.map(p => {
          ProjectVO.toVO(p)
        })))
    })
  }
  
  def get(id: Long) = auth.JWTAuthentication.async {
    val projectFuture = projectRepo.get(id)

    projectFuture.map(p => {
      if (p == None) Ok(resKO(JsString("El proyecto buscado no existe")))
      else {
//        println(Json.toJson(ProjectVO.toVO(p.get)))
        Ok(Json.toJson(ProjectVO.toVO(p.get)))
      }
    })
  }
  
  def add = auth.JWTAuthentication.async { implicit request =>
    ProjectVO.projectVOForm.bindFromRequest.fold(
      errorForm => {
//        println(errorForm)
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
//        println("PROYECTO a AÑADIR: " + ProjectVO.toProject(data))
        projectRepo.save(ProjectVO.toProject(data))
          .map(r => {
//            println(r)
            Ok(resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { Ok(resKO(JsString(e.getMessage))) }
          }
    })
  }
  
    def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    ProjectVO.projectVOForm.bindFromRequest.fold(
      errorForm => Future.failed(new Exception),
//      errorForm => Future.apply(Ok(resKO(JsString("")))),
      
      data => {
        println("A editar: " + data)
        projectRepo.update(ProjectVO.toProject(data))
          .map(p => {/*println("OK");*/ Ok(resOK(JsString("Proyecto actualizado.")))})
          .recover{ case e => {
//            println(e) 
            Ok(resKO(JsString(e.getMessage)))
          } 
        }
      }
    )
  }
    
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    println("deleting...")
    projectRepo.delete(id).map(x => Ok(resOK(JsString("Proyecto eliminado")))).recover { case e => Ok(resKO(JsString(e.getMessage))) }
  }
}