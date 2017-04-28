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

class UserAuthenticationSpec extends AcceptanceSpec[Researcher] with BeforeAndAfter {
  implicit var userReads = Json.reads[Researcher]
  implicit var userWrites = Json.writes[Researcher]
  implicit var userFormat = Json.format[Researcher]
  
  var token: String = null
  
  before {
    val resp = route(app, FakeRequest(
        POST, "/users/login", 
        FakeHeaders(Seq("content-type" -> "application/json")), 
        Json.parse("""{"email":"mnceleiro@esei.uvigo.es", "password":"1234"}"""))
    ).get
    
    this.token = Json.parse(contentAsString(resp)).as[JsObject].\("token").get.as[String]
  }
  
  after {
    
  }
  
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
      
//      println(Json.parse(contentAsString(resp)))
      json.\("userId").get.as[Int] mustBe 1
      json.\("email").get.as[String] mustEqual  "mnceleiro@esei.uvigo.es"
      json.\("firstName").get.as[String] mustEqual "Marcos"
      json.\("lastName").get.as[String] mustEqual "Nunez Celeiro"
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