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
import vos.CongressVO
import models.repositories.AuthorCongressRepository
import play.api.libs.json.JsValue
import models.entities.Congress
import models.entities.AuthorCongress
import vos.ProjectVO
import vos.BookVO
import models.repositories.AuthorProjectRepository
import models.repositories.AuthorBookRepository
import vos.AuthorVO
import models.entities.Author
import vos.ResearcherVO
import models.repositories.AuthorRepository

case class UserRequest[A](user: User, request: Request[A]) extends WrappedRequest(request) {
  def userGet = user
}

class SecuredAuthenticator @Inject() (
    userRepo: UserRepository, 
    acRepo: AuthorCongressRepository,
    apRepo: AuthorProjectRepository,
    abRepo: AuthorBookRepository,
    
    authorRepo: AuthorRepository
) extends Controller {
  implicit val formatUserDetails = Json.format[User]

  object JWTAuthentication extends ActionBuilder[Request] {
    def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] = {
      val jwtToken = request.headers.get("Authorization").getOrElse("").replace("Bearer ", "")
      
      if (JWTUtils.isValidToken(jwtToken)) {
        JWTUtils.decodePayload(jwtToken).fold {
          Future.successful(Results.Unauthorized("Invalid credential"))
        } { payload =>
          val id = Json.parse(payload).\("userId").as[Long]
          val theUser = userRepo.get(id)
          
          theUser.flatMap(us => {
            if (us == None) Future.successful(Results.Unauthorized("Invalid credential"))
            else if (!us.get.access) Future.successful(Results.Unauthorized("Not authorized"))
            else if (us.get.admin) block(UserRequest(us.get, request))
            else if (request.method == "POST" || request.method == "DELETE") {
              
              if (request.method == "POST") checkPostAuthorization(id, request, block, us.get)
              else checkDeleteAuthorization(id, request, block, us.get)
              
            } else block(UserRequest(us.get, request))
          })
        }
      } else {
        Future.successful(Results.Unauthorized("Invalid credential"))
      }
    }
    
    def checkDeleteAuthorization[A](userId: Long, request: Request[A], block: (Request[A] => Future[Result]), us: User) = {
      val isCongress = request.uri.contains("congresses")
      val isBook = request.uri.contains("books")
      val isProject = request.uri.contains("projects")
      val isAuthor = request.uri.contains("authors")
      val isResearcher = request.uri.contains("researchers")
      val entityId = request.uri.split("/").lastOption.get
      
      if (isCongress) {
        val tableId = acRepo.checkAuthorHasCongress(userId, entityId.toInt)
        tableId.flatMap(x => {
          if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
        })
        
      } else if (isBook) {
        val tableId = abRepo.checkAuthorHasBook(userId, entityId.toInt)
        tableId.flatMap(x => {
          if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
        })
        
      } else if (isProject) {
        val tableId = apRepo.checkAuthorHasProject(userId, entityId.toInt)
        tableId.flatMap(x => {
          if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
        })
        
      } else if (isAuthor) {
        val tableId = authorRepo.get(entityId.toInt)
        tableId.flatMap(x => {
          if (!x.isDefined || x.get.researcherId != userId) Future.successful(Results.Unauthorized("Not authorized"))
          else block(UserRequest(us, request))
        })
        
      } else if (isResearcher) {
        if (entityId == userId) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
        
      } else Future.successful(Results.Unauthorized("Not authorized uknown entity"))
    }
    
    def checkPostAuthorization[A](userId: Long, request: Request[A], block: (Request[A] => Future[Result]), us: User) = {
      val isCongress = request.uri.contains("congresses")
      val isBook = request.uri.contains("books")
      val isProject = request.uri.contains("projects")
      val isAuthor = request.uri.contains("authors")
      val isResearcher = request.uri.contains("researchers")
      
      val body: AnyContent = request.body.asInstanceOf[AnyContent]
      val jsonBodyOption: Option[JsValue] = body.asJson
      val jsonBody = jsonBodyOption.get
      
      if (isCongress) {
        CongressVO.congressVOForm.bindFromRequest()(request).fold(
          errors => {
            block(UserRequest(us, request))
          },
          data => {
            val tableId = apRepo.checkAuthorHasProject(userId, data.id)
            tableId.flatMap(x => {
              if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
            })
        })
        
      } else if (isBook) {
        BookVO.bookVOForm.bindFromRequest()(request).fold(
          errors => {
            block(UserRequest(us, request))
          },
          data => {
            val tableId = apRepo.checkAuthorHasProject(userId, data.id.get)
            tableId.flatMap(x => {
              if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
            })
        })
        
      } else if (isProject) {
        ProjectVO.projectVOForm.bindFromRequest()(request).fold(
          errors => {
            block(UserRequest(us, request))
          },
          data => {
            val tableId = apRepo.checkAuthorHasProject(userId, data.id)
            tableId.flatMap(x => {
              if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
            })
        })
      } else if (isAuthor) {
        Author.authorForm.bindFromRequest()(request).fold(
          errors => {
            block(UserRequest(us, request))
          },
          data => {
            val hasPermissions = data.researcherId.map(x => x == userId).get
            if (hasPermissions) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
        })
        
      } else if (isResearcher) {
        ResearcherVO.researcherVOForm.bindFromRequest()(request).fold(
          errors => {
            block(UserRequest(us, request))
          },
          data => {
            val hasPermissions = data.usId == userId && data.access == us.access && data.admin == us.admin
            if (hasPermissions) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
        })
        
      } else Future.successful(Results.Unauthorized("Not authorized uknown entity"))
      
//      if (request.method == "POST") {
//        val body: AnyContent = request.body.asInstanceOf[AnyContent]
//        val jsonBodyOption: Option[JsValue] = body.asJson
//        val jsonBody = jsonBodyOption.get
//        
//        val c = jsonBody.as[CongressVO]
//        val tableId = acRepo.checkAuthorHasCongress(userId, c.id)
//        
//        
//        val asd = tableId.flatMap(x => {
//          if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
//        })
//        asd
//      } else {
//        val entityId = request.uri.split("/").lastOption.get
//        val tableId = acRepo.checkAuthorHasCongress(userId, entityId.toInt)
//        val asd = tableId.flatMap(x => {
//          if (x.isDefined) block(UserRequest(us, request)) else Future.successful(Results.Unauthorized("Not authorized"))
//        })
//        asd
//      }
    }
  }
}