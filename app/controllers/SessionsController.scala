package controllers

import scala.concurrent.Future

import javax.inject._
import utils.JWTUtils
import utils.Password

import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc._
import play.api.libs.json.JsObject
import play.api.libs.json.JsString
import play.api.libs.json.Json

import models.entities.User
import play.api.libs.json.JsValue
import java.util.Calendar
import models.repositories.UserRepository
import models.entities.JsonMessage

class SessionsController @Inject() (userRepo: UserRepository, auth: SecuredAuthenticator) extends Controller {
  def login = Action.async { request =>
    val userData = request.body.asJson.getOrElse(null)
    if (userData == null) Future.successful(Ok(JsonMessage.resKO(JsString("Usuario o contraseña incorrectos."))))

    userRepo.getByEmail((userData \ "email").as[String]).flatMap { dbUserOpt =>
      dbUserOpt match {
        case Some(dbUser) => {
          val equals = Password.checkPassword((userData \ "password").as[String], dbUser.password.get)

          if (equals) {
            var toret = Json.obj(
              "userId" -> dbUser.id,
              "email" -> dbUser.email,
              "token" -> JWTUtils.createToken(Json.stringify(Json.obj(
                "userId" -> dbUser.id,
                "email" -> dbUser.email,
                "admin" -> dbUser.admin,
                "generated" -> Calendar.getInstance().getTime()))))

            if (dbUser.access) Future.successful(Ok(Json.stringify(toret)))
            else Future.successful(Ok(JsonMessage.resKO(JsString("Usuario sin acceso. Si quiere acceso a la página debe consultar con un administrador."))))

          } else {
            Future.successful(Ok(JsonMessage.resKO(JsString("Usuario o contraseña incorrectos"))))
          }
        }

        case None => Future.successful(Ok(JsonMessage.resKO(JsString("Usuario o contraseña incorrectos"))))
      }
    }
  }
}