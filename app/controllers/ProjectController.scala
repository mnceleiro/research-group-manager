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

class ProjectController @Inject()(
    projectRepo: ProjectRepository,
    authorProjectRepo: AuthorProjectRepository,
    auth: SecuredAuthenticator
  ) extends Controller {
  
	implicit val researcherVOFormat = Json.format[ResearcherVO]
	
	implicit val authorOfProjectFormat = Json.format[AuthorOfProjectVO]
	implicit val authorOfProjectWrites = Json.writes[AuthorOfProjectVO]
	implicit val authorOfProjectReads = Json.reads[AuthorOfProjectVO]

	implicit val projectFormat = Json.format[ProjectVO]
	implicit val projectWrites = Json.writes[ProjectVO]
	implicit val projectReads = Json.reads[ProjectVO]
	
//	implicit val projectWithAuthorsFormat = Json.format[ProjectWithAuthorsVO]
//	implicit val projectWithAuthorsWrites = Json.writes[ProjectWithAuthorsVO]
//	implicit val projectWithAuthorsReads = Json.reads[ProjectWithAuthorsVO]
  
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
  
  def getWithAuthors(id: Long) = auth.JWTAuthentication.async {
    val projectFuture = authorProjectRepo.getProjectWithAuthors(id)
    
    projectFuture.map(p => {
      if (p == None) Ok(resKO(JsString("El proyecto buscado no existe")))
      else {
        Ok(Json.toJson(ProjectVO.toProjectVOWithAuthors(p)))
      }
    })
  }
  
  def add = auth.JWTAuthentication.async { implicit request =>
    ProjectVO.projectVOForm.bindFromRequest.fold(
      errorForm => {
        println(errorForm)
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
//        println("PROYECTO a AÑADIR: " + ProjectVO.toProject(data))
        var p1 = ProjectVO.toProject(data)
        var aps = data.authors.map(a => {
          var ap = AuthorProject(None, a.id, p1.id, a.role)
          ap
        })
        var as = data.authors.map(a => {
          Author(a.id, a.email, a.signature, a.researcherId)
        })
        
//        println(p1, aps, as)
        authorProjectRepo.save(p1, aps, as).map(r => {
//            println(r)
            Ok(resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { println(e); Ok(resKO(JsString(e.getMessage))) }
          }
    })
  }
  
  def addWithAuthors = auth.JWTAuthentication.async { implicit request =>
    ProjectVO.projectVOForm.bindFromRequest.fold(
      errorForm => {
//        println(errorForm)
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
//        println("PROYECTO a AÑADIR: " + data)
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
        var p1 = ProjectVO.toProject(data)
        var aps = data.authors.map(a => {
          var ap = AuthorProject(None, a.id, p1.id, a.role)
          ap
        })
        var as = data.authors.map(a => {
          Author(a.id, a.email, a.signature, a.researcherId)
        })
//        println(p1, aps, as)
//        var toUpdate = (p1, aps, as)
        authorProjectRepo.update(p1, aps, as).map(_ => 
          Ok(resOK(JsString("Proyecto actualizado.")))
        ).recover { case e => {
          println(e)
          Ok(resKO(JsString(e.getMessage)))
        }}

            
//        projectRepo.update(ProjectVO.toProject(data))
//          .map(p => {Ok(resOK(JsString("Proyecto actualizado.")))})
//          .recover { case e => {
//            Ok(resKO(JsString(e.getMessage)))
//          } 
//        }
      }
    )
  }
    
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
//    println("deleting...")
    authorProjectRepo.delete(id).map(x => Ok(resOK(JsString("Proyecto eliminado")))).recover { case e => Ok(resKO(JsString(e.getMessage))) }
  }
}