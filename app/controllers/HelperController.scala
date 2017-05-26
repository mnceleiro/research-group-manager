package controllers

import com.google.inject.Inject
import play.api.mvc.Controller
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits._

import models.repositories.RoleRepository
import models.entities.Role
import models.repositories.PublicationStatusRepository
import models.repositories.CongressTypeRepository

class HelperController @Inject() (
    rolesRepo: RoleRepository, publicationStatusRepo: PublicationStatusRepository, congressTypesRepo: CongressTypeRepository,
    auth: SecuredAuthenticator) extends Controller {

  def getAllRoles = auth.JWTAuthentication.async {
    rolesRepo.listAll.map(rs => Ok(Json.toJson(rs)))
  }

  def getAllCongressTypes = auth.JWTAuthentication.async {
    congressTypesRepo.listAll.map(rs => Ok(Json.toJson(rs)))
  }

  def getAllPublicationStatus = auth.JWTAuthentication.async {
    publicationStatusRepo.listAll.map(rs => Ok(Json.toJson(rs)))
  }
}