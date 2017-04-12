package controllers

import scala.concurrent.Future

import javax.inject._
import services.ResearcherService
import utils.JWTUtils
import utils.Password

import play.api.libs.concurrent.Execution.Implicits._
import play.api.mvc._
import play.api.libs.json.JsObject
import play.api.libs.json.JsString
import play.api.libs.json.Json

import models.entities.Researcher
import play.api.libs.json.JsValue
import java.util.Calendar

class SessionsController @Inject() (researcherService: ResearcherService) extends Controller {
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("error" -> error)

  def login = Action.async { request =>
    val userData = request.body.asJson.get

    researcherService.getByEmail((userData \ "email").as[String]).flatMap { dbUserOpt =>
//      val dbUser = dbUserOpt.getOrElse(Future.successful(Ok(resKO(JsString("Usuario o contraseña incorrectos")))))
      dbUserOpt match {
        case Some(dbUser) => {
//          val equals = Password.hashPassword((userData \ "password").as[String]).get == dbUser.password.get
          val equals = Password.checkPassword(
              (userData \ "password").as[String], dbUser.password.get
          )
          
//          println(Password.hashPassword((userData \ "password").as[String]).get)
//          println(dbUser.password.get)
          if (equals) {
            var toret = Json.obj(
              "userId" -> dbUser.id,
              "email" -> dbUser.email,
              "firstName" -> dbUser.firstName,
              "lastName" -> dbUser.lastName,
              "token" -> JWTUtils.createToken(Json.stringify(Json.obj(
                "userId" -> dbUser.id,
                "email" -> dbUser.email,
                "generated" -> Calendar.getInstance().getTime()
              )))
            )
    
//            println(Json.stringify(toret))
            Future.successful(Ok(Json.stringify(toret)))
    
          } else
            Future.successful(Ok(resKO(JsString("Usuario o contraseña incorrectos"))))
        }
        
        case None => Future.successful(Ok(resKO(JsString("Usuario o contraseña incorrectos"))))
      }
    }
  }
}