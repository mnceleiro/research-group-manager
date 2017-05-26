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
import models.repositories.AuthorProjectRepository
import vos.AuthorOfProjectVO
import models.entities.Author
import models.entities.JsonMessage

class ProjectController @Inject()(
    projectRepo: ProjectRepository,
    authorProjectRepo: AuthorProjectRepository,
    auth: SecuredAuthenticator
  ) extends Controller {
  
  def getAll = auth.JWTAuthentication.async {
    val projects = projectRepo.listAll
    projects.map(projectList => {
      Ok(Json.toJson(
        projectList.map(p => {
          ProjectVO.toVO(p)
        })))
    })
  }
  
  def getWithAuthors(id: Long) = auth.JWTAuthentication.async {
    val projectFuture = authorProjectRepo.getProject(id)
    
    projectFuture.map(p => {
      if (p == None) Ok(JsonMessage.resKO(JsString("El proyecto buscado no existe")))
      else {
        Ok(Json.toJson(ProjectVO.toVO(p)))
      }
    })
  }
  
  def add = auth.JWTAuthentication.async { implicit request =>
    ProjectVO.projectVOForm.bindFromRequest.fold(
      errorForm => {
        Future.apply(Ok(JsonMessage.resKO(JsString(""))))
      },
      data => {
        val (p1, aps, as) = ProjectVO.toTuples(data)
        authorProjectRepo.saveProject(p1, aps, as).map(r => {
            Ok(JsonMessage.resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) }
          }
    })
  }
  
  def addWithAuthors = auth.JWTAuthentication.async { implicit request =>
    ProjectVO.projectVOForm.bindFromRequest.fold(
      errorForm => {
        Future.apply(Ok(JsonMessage.resKO(JsString(""))))
      },
      data => {
        projectRepo.save(ProjectVO.toProject(data))
          .map(r => {
            Ok(JsonMessage.resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) }
          }
    })
  }
  
    def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    ProjectVO.projectVOForm.bindFromRequest.fold(
      errorForm => Future.failed(new Exception),
      
      data => {
        val (p1, aps, as) = ProjectVO.toTuples(data)
        authorProjectRepo.updateProject(p1, aps, as).map(_ => 
          Ok(JsonMessage.resOK(JsString("Proyecto actualizado.")))
        ).recover { case e => {
          Ok(JsonMessage.resKO(JsString(e.getMessage)))
        }}
      }
    )
  }
    
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    authorProjectRepo.deleteProject(id).map(x => Ok(JsonMessage.resOK(JsString("Proyecto eliminado")))).recover { case e => Ok(JsonMessage.resKO(JsString(e.getMessage))) }
  }
}