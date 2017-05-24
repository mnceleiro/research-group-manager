package controllers

import com.google.inject.Inject
import play.api.mvc.Controller
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits._

import models.repositories.RoleRepository
import models.entities.Role

class HelperController @Inject() (
    rolesRepo: RoleRepository,
    auth: SecuredAuthenticator) extends Controller {

  implicit var rolesReads = Json.reads[Role]
  implicit var rolesWrites = Json.writes[Role]
  implicit var rolesFormat = Json.format[Role]
  
  def getAllRoles = auth.JWTAuthentication.async {
    rolesRepo.listAll.map(rs => Ok(Json.toJson(rs)))
  }
}