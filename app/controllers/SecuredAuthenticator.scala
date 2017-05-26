package controllers

import play.api.mvc._
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.Future
import models.entities.Researcher
import play.api.libs.json.Json
import javax.inject._
import utils.JWTUtils
import models.repositories.UserRepository
import models.entities.User

case class UserRequest[A](user: User, request: Request[A]) extends WrappedRequest(request)

class SecuredAuthenticator @Inject() (userRepo: UserRepository) extends Controller {
  implicit val formatUserDetails = Json.format[User]

  object JWTAuthentication extends ActionBuilder[Request] {
    def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] = {
      val jwtToken = request.headers.get("Authorization").getOrElse("").replace("Bearer ", "")
      if (JWTUtils.isValidToken(jwtToken)) {
        JWTUtils.decodePayload(jwtToken).fold {
          Future.successful(Results.Unauthorized("Invalid credential"))
        } { payload =>
          val id = Json.parse(payload).\("userId").as[Long]

          userRepo.get(id).flatMap(us => {
            block(UserRequest(us.get, request))
          })
        }
      } else {
        Future.successful(Results.Unauthorized("Invalid credential"))
      }
    }
  }
}