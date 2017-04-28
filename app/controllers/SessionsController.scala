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

class SessionsController @Inject() (userRepo: UserRepository, auth: SecuredAuthenticator) extends Controller {
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)

  implicit val userWrites = Json.writes[User]
  implicit val userReads = Json.reads[User]
  
  def login = Action.async { request =>
    val userData = request.body.asJson.get

    userRepo.getByEmail((userData \ "email").as[String]).flatMap { dbUserOpt =>
      dbUserOpt match {
        case Some(dbUser) => {
          val equals = Password.checkPassword(
            (userData \ "password").as[String], dbUser.password.get)

          if (equals) {
            var toret = Json.obj(
              "userId" -> dbUser.id,
              "email" -> dbUser.email,
              "token" -> JWTUtils.createToken(Json.stringify(Json.obj(
                "userId" -> dbUser.id,
                "email" -> dbUser.email,
                "generated" -> Calendar.getInstance().getTime()))))

            Future.successful(Ok(Json.stringify(toret)))

          } else
            Future.successful(Ok(resKO(JsString("Usuario o contraseña incorrectos"))))
        }

        case None => Future.successful(Ok(resKO(JsString("Usuario o contraseña incorrectos"))))
      }
    }
  }

  def add = auth.JWTAuthentication.async { implicit request =>
    User.userForm.bindFromRequest.fold(
      errorForm => {
        //        println(errorForm)
        Future.apply(Ok(resKO(JsString(""))))
      },
      data => {
        userRepo.save(data.copy(password = Password.hashPassword(data.password.get)))
          .map(r => Ok(resOK(JsString("Investigador creado"))))
          .recover {
            case e => Ok(resKO(JsString(e.getMessage)))
          }
      })
  }
}