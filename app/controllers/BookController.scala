package controllers

import com.google.inject.Inject

import play.api.mvc.Controller
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits.defaultContext

import models.repositories.BookRepository
import vos.BookVO
import models.entities.Book
import play.api.libs.json.JsString
import vos.ResearcherVO
import scala.concurrent.Future
import models.entities.AuthorBook
import models.repositories.AuthorBookRepository
import vos.AuthorOfBookVO
import models.entities.Author
import models.entities.JsonMessage
import play.api.i18n.I18nSupport
import play.api.i18n.MessagesApi

class BookController @Inject()(
    bookRepo: BookRepository,
    authorBookRepo: AuthorBookRepository,
    auth: SecuredAuthenticator,
    implicit val messagesApi: MessagesApi
  ) extends Controller with I18nSupport {
  
  def getAll = auth.JWTAuthentication.async {
    val books = bookRepo.listAll
    books.map(bookList => {
      Ok(Json.toJson(
        bookList.map(b => {
          BookVO.toVO(b)
        })))
    })
  }
  
  def getWithAuthors(id: Long) = auth.JWTAuthentication.async {
    val bookFuture = authorBookRepo.getBook(id)
    
    bookFuture.map(p => {
      if (p == None) Ok(JsonMessage.resKO(JsString("El proyecto buscado no existe")))
      else {
        Ok(Json.toJson(BookVO.toVO(p)))
      }
    })
  }
  
  def add = auth.JWTAuthentication.async { implicit request =>
    BookVO.bookVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson)))
      },
      data => {
        val (b1, abs, as) = BookVO.toTuples(data)
        authorBookRepo.saveBook(b1, abs, as).map(r => {
            Ok(JsonMessage.resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) }
          }
    })
  }
  
  def addWithAuthors = auth.JWTAuthentication.async { implicit request =>
    BookVO.bookVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson)))
      },
      data => {
        bookRepo.save(BookVO.toBook(data))
          .map(r => {
            Ok(JsonMessage.resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) }
          }
    })
  }
  
    def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    BookVO.bookVOForm.bindFromRequest.fold(
      errorForm => Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson))),
      
      data => {
        val (p1, aps, as) = BookVO.toTuples(data)
        authorBookRepo.updateBook(p1, aps, as).map(_ => 
          Ok(JsonMessage.resOK(JsString("Proyecto actualizado.")))
        ).recover { case e => {
          Ok(JsonMessage.resKO(JsString(e.getMessage)))
        }}
      }
    )
  }
    
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    authorBookRepo.deleteBook(id).map(x => Ok(JsonMessage.resOK(JsString("Proyecto eliminado")))).recover { case e => Ok(JsonMessage.resKO(JsString(e.getMessage))) }
  }
}