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

//class BasicAuthAction(username: String, password: String) extends ActionBuilder[Request] with ActionFilter[Request] {
//
//  private val unauthorized = Results.Unauthorized.withHeaders("WWW-Authenticate" -> "Basic realm=Unauthorized")
//
//  def filter[A](request: Request[A]): Future[Option[Result]] = {
//    val result = request.headers.get("Authorization") map { authHeader =>
//      val (user, pass) = decodeBasicAuth(authHeader)
//      if (user == username && pass == password) None else Some(unauthorized)
//    } getOrElse Some(unauthorized)
//
//    Future.successful(result)
//  }
//
//  private [this] def decodeBasicAuth(authHeader: String): (String, String) = {
//    val baStr = authHeader.replaceFirst("Basic ", "")
//    val decoded = new sun.misc.BASE64Decoder().decodeBuffer(baStr)
//    val Array(user, password) = new String(decoded).split(":")
//    (user, password)
//  }
//}
//case class AuthorizedRequest[A](request: Request[A], user: Researcher) extends WrappedRequest(request)
//
//class AuthorizedAction(userService: ResearcherRepository) extends ActionBuilder[AuthorizedRequest] {
//
//  override def invokeBlock[A](request: Request[A], block: (AuthorizedRequest[A]) ⇒ Future[Result]): Future[Result] = {
//    request.headers.get(AuthTokenHeader).orElse(request.getQueryString(AuthTokenUrlKey)) match {
//      case Some(token) => userService.findByToken(token).map {
//        case Some(user) =>
//          val req = AuthorizedRequest(request, user)
//          block(req)
//        case None => Future.successful(Results.Unauthorized)
//      }
//      case None => Future.successful(Results.Unauthorized)
//    }
//
//  }
//}

case class UserRequest[A](user: User, request: Request[A]) extends WrappedRequest(request)

class SecuredAuthenticator @Inject() (userRepo: UserRepository) extends Controller {
  implicit val formatUserDetails = Json.format[User]

  object JWTAuthentication extends ActionBuilder[Request] {
    def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] = {
      val jwtToken = request.headers.get("Authorization").getOrElse("").replace("Bearer ", "")
//      println(jwtToken)
      if (JWTUtils.isValidToken(jwtToken)) {
        JWTUtils.decodePayload(jwtToken).fold {
          Future.successful(Results.Unauthorized("Invalid credential"))
        } { payload =>
//          println(payload)
//          val userCredentials = Json.parse(payload).validate[Researcher].get
          val id = Json.parse(payload).\("userId").as[Long]

          // Replace this block with data source
          //          val maybeUserInfo = dataSource.getUser(userCredentials.email, userCredentials.userId)
          userRepo.get(id).flatMap(us => {
            //              Future.successful(Unauthorized("Invalid credential"))
            block(UserRequest(us.get, request))
          })
          //            val list = List[Future[Option[Researcher]]](maybeUserInfo)
          //            maybeUserInfo.fold(Future.successful(Unauthorized("Invalid credential")))(researcher => block(UserRequest(researcher, request)))
        }
      } else {
        Future.successful(Results.Unauthorized("Invalid credential"))
      }
    }
  }
}