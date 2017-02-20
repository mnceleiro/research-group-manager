package controllers

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.test._
import play.api.test.Helpers._

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import models.entities.Researcher

class ResearcherControllerSpec extends AcceptanceSpec[Researcher] {
  
  implicit var userReads = Json.reads[Researcher]
  implicit var userWrites = Json.writes[Researcher]
  implicit var userFormat = Json.format[Researcher]
  
  "Researcher controller" should {
    
    "return 5 researchers" in {
      val resp = route(app, FakeRequest(GET, "/researchers/all")).get
      
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val researcherList = Json.parse(contentAsString(resp)).validate[List[Researcher]].get
      
      researcherList.length mustBe 5
    }
    
    "return first researcher with all the fields non-empty" in {
      val resp = route(app, FakeRequest(GET, "/researchers/id/1")).get
      
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val jsonRes = Json.parse(contentAsString(resp))
      val bindForm = Researcher.researcherForm.bind(jsonRes)
      val res = jsonRes.validate[Researcher].get
    }
    
    "Insert new researcher and return a JSON valid response" in {
      val newRes = Researcher(0, "aturing@paddington.com", "1234", "Alan", "Mathison Turing", "Alan Mathison-Turing", "Paddington 18", "9825312123")
      
      val resp = route(
          app, 
          FakeRequest(
              POST, 
              "/researchers/add",
              FakeHeaders(Seq(("content-type", "application/json"))),
              Json.toJson(newRes)
          )
      ).get
      
      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
    }
  }
  
  "Insert new researcher with incorrect email will return an error 500" in {
    val newRes = Researcher(0, "aturingpaddington.com", "1234", "Alan", "Mathison Turing", "Alan Mathison-Turing", "Paddington 18", "9825312123")
    
    
  }
}