package controllers

import com.google.inject.Inject

import play.api.mvc.Controller
import play.api.libs.json.JsValue
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits.defaultContext

import models.repositories.JournalRepository
import vos.JournalVO
import models.entities.Journal
import play.api.libs.json.JsString
import vos.ResearcherVO
import scala.concurrent.Future
import models.entities.AuthorJournal
import models.repositories.AuthorJournalRepository
import vos.AuthorOfJournalVO
import models.entities.Author
import models.entities.JsonMessage
import play.api.i18n.I18nSupport
import play.api.i18n.MessagesApi

class JournalController @Inject()(
    journalRepo: JournalRepository,
    authorJournalRepo: AuthorJournalRepository,
    auth: SecuredAuthenticator,
    implicit val messagesApi: MessagesApi
  ) extends Controller with I18nSupport {
  
  def getAll = auth.JWTAuthentication.async {
    val journals = journalRepo.listAll
    journals.map(journalList => {
      Ok(Json.toJson(
        journalList.map(j => {
          JournalVO.toVO(j)
        })))
    })
  }
  
  def getWithAuthors(id: Long) = auth.JWTAuthentication.async {
    val journalFuture = authorJournalRepo.getJournal(id)
    
    journalFuture.map(p => {
      if (p == None) Ok(JsonMessage.resKO(JsString("El proyecto buscado no existe")))
      else {
        Ok(Json.toJson(JournalVO.toVO(p)))
      }
    })
  }
  
  def add = auth.JWTAuthentication.async { implicit request =>
    JournalVO.journalVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson)))
      },
      data => {
        val (b1, abs, as) = JournalVO.toTuples(data)
        authorJournalRepo.saveJournal(b1, abs, as).map(r => {
            Ok(JsonMessage.resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) }
          }
    })
  }
  
  def addWithAuthors = auth.JWTAuthentication.async { implicit request =>
    JournalVO.journalVOForm.bindFromRequest.fold(
      errorForm => {
        Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson)))
      },
      data => {
        journalRepo.save(JournalVO.toJournal(data))
          .map(r => {
            Ok(JsonMessage.resOK(JsString("Proyecto creado")))
            
          }).recover {
            case e => { Ok(JsonMessage.resKO(JsString(e.getMessage))) }
          }
    })
  }
  
    def update(id: Long) = auth.JWTAuthentication.async { implicit request =>
    JournalVO.journalVOForm.bindFromRequest.fold(
      errorForm => Future.successful(Ok(JsonMessage.resKO(errorForm.errorsAsJson))),
      
      data => {
        val (p1, aps, as) = JournalVO.toTuples(data)
        authorJournalRepo.updateJournal(p1, aps, as).map(_ => 
          Ok(JsonMessage.resOK(JsString("Proyecto actualizado.")))
        ).recover { case e => {
          Ok(JsonMessage.resKO(JsString(e.getMessage)))
        }}
      }
    )
  }
    
  def delete(id: Long) = auth.JWTAuthentication.async { implicit request =>
    authorJournalRepo.deleteJournal(id).map(x => Ok(JsonMessage.resOK(JsString("Proyecto eliminado")))).recover { case e => Ok(JsonMessage.resKO(JsString(e.getMessage))) }
  }
}