package controllers

import play.api.test.FakeRequest
import models.entities.Researcher
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits._
import play.api.test._
import play.api.test.Helpers._
import play.api.libs.json.JsObject
import utils.JWTUtils
import org.scalatest.BeforeAndAfter
import models.entities.User

class UserAuthenticationSpec extends AcceptanceSpec[Researcher] {
  implicit var resReads = Json.reads[Researcher]
  implicit var resWrites = Json.writes[Researcher]
  implicit var resFormat = Json.format[Researcher]
  
  implicit var usReads = Json.reads[User]
  implicit var usWrites = Json.writes[User]
  implicit var usFormat = Json.format[User]
  
  var token: String = null
  
  "UserAuthentication" should {
    "authenticate with an user/password" in {
      val resp = route(app, FakeRequest(
          POST, "/users/login", 
          FakeHeaders(Seq("content-type" -> "application/json")), 
          Json.parse("""{"email":"mnceleiro@esei.uvigo.es", "password":"1234"}"""))
      ).get
      
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp)).as[JsObject]
      val token = json.\("token").get
      
      json.\("userId").get.as[Int] mustBe 1
      json.\("email").get.as[String] mustEqual  "mnceleiro@esei.uvigo.es"
      JWTUtils.isValidToken(token.as[String]) mustBe true
    }
    
    "return bad email/password response message" in {
      val resp = route(app, FakeRequest(
          POST, "/users/login", 
          FakeHeaders(Seq("content-type" -> "application/json")), 
          Json.parse("""{"email":"mnceleiro@esei.uvigo.es", "password":"3214444443243243"}"""))
      ).get
      
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp)).as[JsObject]
      json.\("res").get.as[String] mustEqual "error"
      
    }
  }
}