package controllers

import models.repositories.AuthorProjectRepository
import com.google.inject.Inject
import play.api.mvc.Controller
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits._
import models.entities.AuthorProject
import vos.ProjectVO
import models.entities.ProjectWithAuthors

class AuthorProjectController @Inject() (
    repo: AuthorProjectRepository,
    auth: SecuredAuthenticator) extends Controller {

	implicit val projectWithAuthorsFormat = Json.format[AuthorProject]
	implicit val projectWithAuthorsWrites = Json.writes[AuthorProject]
	implicit val projectWithAuthorsReads = Json.reads[AuthorProject]
	
  implicit val projectWrites = Json.writes[ProjectVO]
//  implicit val projectReads = Json.reads[ProjectVO]
//  implicit val projectFormat = Json.format[ProjectVO]
  
  def getAll = auth.JWTAuthentication.async {
//    repo.projectsWithAuthors.map(ps => {
//      println(ps)
//      Ok("")
//    })
    repo.listProjectsWithAuthors.map(els => {
      println(els)
      Ok(Json.toJson(els.map(el => ProjectVO.toVOWithAuthors(el))))
    })
  }
}