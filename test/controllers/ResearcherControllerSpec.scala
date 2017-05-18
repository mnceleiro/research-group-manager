package controllers

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.test._
import play.api.test.Helpers._

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import models.entities.Researcher
import play.api.libs.json.JsObject
import models.entities.Role
import vos.ResearcherVO

class ResearcherControllerSpec extends AcceptanceSpec[Researcher] with BeforeAndAfter {

  implicit var userReads = Json.reads[Researcher]
  implicit var userWrites = Json.writes[Researcher]
  implicit var userFormat = Json.format[Researcher]
  
  implicit var userReadsVO = Json.reads[ResearcherVO]
  implicit var userWritesVO = Json.writes[ResearcherVO]
  implicit var userFormatVO = Json.format[ResearcherVO]
  
  implicit var roleReads = Json.reads[Role]

  var tokenString: String = null
  var fakeTextHeaders: FakeHeaders = null
  var fakeJsonHeaders: FakeHeaders = null

  before {
    val resp = route(app, FakeRequest(
      POST, "/users/login",
      FakeHeaders(Seq("content-type" -> "application/json")),
      Json.parse("""{"email":"mnceleiro@esei.uvigo.es", "password":"1234"}"""))).get

    this.tokenString = "Bearer " + Json.parse(contentAsString(resp)).as[JsObject].\("token").get.as[String]

    this.fakeTextHeaders = FakeHeaders(Seq(
      ("content-type" -> "text/plain"),
      ("Authorization", this.tokenString)))

    this.fakeJsonHeaders = FakeHeaders(Seq(
      ("content-type" -> "application/json"),
      ("Authorization", this.tokenString)))
  }

  after {

  }

  "Researcher controller" should {
    
//    "Return 6 user roles" in {
//      val resp = route(app, FakeRequest(
//        GET,
//        "/researchers/roles/all",
//        fakeJsonHeaders,
//        "")).get
//        
//        status(resp) mustBe OK
//        contentType(resp) mustBe Some("application/json")
//      
//        val roles = Json.parse(contentAsString(resp)).validate[List[Role]].get
//        
//        roles.length mustBe 6
//
//    }

    "return 5 researchers" in {
      val resp = route(app, FakeRequest(
        GET,
        "/researchers/all",
        //          FakeHeaders(Seq(
        //              ("content-type" -> "text/plain"), 
        //              ("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibW5jZWxlaXJvQGVzZWkudXZpZ28uZXMiLCJnZW5lcmF0ZWQiOjE0OTE4OTg5MjY3MTB9.XewJTpzoZKcEdABq0G7o-p82xfES1aCngSR0XDzkcbUBearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibW5jZWxlaXJvQGVzZWkudXZpZ28uZXMiLCJnZW5lcmF0ZWQiOjE0OTE4OTg5MjY3MTB9.XewJTpzoZKcEdABq0G7o-p82xfES1aCngSR0XDzkcbU")
        //          )),
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      val researcherList = Json.parse(contentAsString(resp)).validate[List[ResearcherVO]].get
      researcherList.length mustBe 5
    }

    "return first researcher with all the fields non-empty" in {
      val resp = route(app, FakeRequest(GET, "/researchers/id/1", fakeJsonHeaders, "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")

      val jsonRes = Json.parse(contentAsString(resp))
      val bindForm = ResearcherVO.researcherForm.bind(jsonRes)
      val res = jsonRes.validate[ResearcherVO].get
    }

    "Insert new researcher and return a JSON valid response" in {
      val newRes = ResearcherVO(0, 0, "aturing@paddington.com", Option("1234"), Option("1234"), true, true, 0, "Alan", "Mathison Turing", "Paddington 18", "9825312123")

      val resp = route(
        app,
        FakeRequest(
          POST,
          "/researchers/add",
          fakeJsonHeaders,
          Json.toJson(newRes))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp))
      assert(json.\("res").as[String] !== "error")
    }

    "Insert new researcher with incorrect email will return an error in json response" in {
      val newRes = ResearcherVO(0, 0, "aturingpaddington.com", Option("1234"), Option("1234"), true, true, 0, "Alan", "Mathison Turing", "Paddington 18", "9825312123")

      val resp = route(
        app,
        FakeRequest(
          POST,
          "/researchers/add",
          fakeJsonHeaders,
          Json.toJson(newRes))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK

      val json = Json.parse(contentAsString(resp))
      val resCode = json.as[JsObject].\("res").get
      println(json)
      resCode.as[String] mustEqual "error"
    }

    "Deleting a researcher with an ID 6 will return a response OK" in {
      val resp = route(
        app,
        FakeRequest(
          DELETE,
          "/researchers/delete/6",
          fakeJsonHeaders,
          Json.toJson(""))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK

      val json = Json.parse(contentAsString(resp))
      val resCode = json.as[JsObject].\("res").get
      resCode.as[String] mustEqual "OK"
    }

    "return 5 researchers after the add and the delete" in {
      val resp = route(app, FakeRequest(
        GET,
        "/researchers/all",
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val researcherList = Json.parse(contentAsString(resp)).validate[List[ResearcherVO]].get
      researcherList.length mustBe 5
    }
  }
}