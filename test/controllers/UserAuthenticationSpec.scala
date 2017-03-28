package controllers

import play.api.test.FakeRequest
import models.entities.Researcher
import play.api.libs.json.Json
import play.api.libs.concurrent.Execution.Implicits._
import play.api.test._
import play.api.test.Helpers._

class UserAuthenticationSpec extends AcceptanceSpec[Researcher]{
  implicit var userReads = Json.reads[Researcher]
  implicit var userWrites = Json.writes[Researcher]
  implicit var userFormat = Json.format[Researcher]
  
  "UserAuthentication" should {
    
    "save new Researcher with hashed password" in {
      val resp = route(app, FakeRequest(
          POST, "/users/login", 
          FakeHeaders(Seq("Authorization" -> "Basic QWxhZGRpbjpPcGVuU2VzYW1l", "content-type" -> "application/json")), 
          Json.toJson(""))
      ).get
      
      status(resp) mustBe OK
            
    }
    
    "return 5 researchers" in {
      val resp = route(app, FakeRequest(GET, "/researchers/all")).get
      
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val researcherList = Json.parse(contentAsString(resp)).validate[List[Researcher]].get
      
      researcherList.length mustBe 5
    }
  }
}