package actions

import play.api.mvc._
import scala.concurrent.Future
import models.entities.Researcher
import services.ResearcherService

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
//class AuthorizedAction(userService: ResearcherService) extends ActionBuilder[AuthorizedRequest] {
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