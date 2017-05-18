package controllers

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.test._
import play.api.test.Helpers._

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import play.api.libs.json.JsObject
import vos.CongressVO
import models.entities.Congress
import models.entities.Congress
import vos.CongressVO
import models.entities.Author

class CongressControllerSpec extends AcceptanceSpec[Congress] with BeforeAndAfter {

  implicit var pReads = Json.reads[Congress]
  implicit var pWrites = Json.writes[Congress]
  implicit var pFormat = Json.format[Congress]
  
  implicit var authorReads = Json.reads[Author]
  implicit var authorWrites = Json.writes[Author]
  implicit var authorFormat = Json.format[Author]
  
  implicit var pReadsVO = Json.reads[CongressVO]
  implicit var pWritesVO = Json.writes[CongressVO]
  implicit var pFormatVO = Json.format[CongressVO]
  
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

  "Congress controller" should {

    "return 1 congress" in {
      val resp = route(app, FakeRequest(
        GET,
        "/congresses/all",
        //          FakeHeaders(Seq(
        //              ("content-type" -> "text/plain"), 
        //              ("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibW5jZWxlaXJvQGVzZWkudXZpZ28uZXMiLCJnZW5lcmF0ZWQiOjE0OTE4OTg5MjY3MTB9.XewJTpzoZKcEdABq0G7o-p82xfES1aCngSR0XDzkcbUBearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibW5jZWxlaXJvQGVzZWkudXZpZ28uZXMiLCJnZW5lcmF0ZWQiOjE0OTE4OTg5MjY3MTB9.XewJTpzoZKcEdABq0G7o-p82xfES1aCngSR0XDzkcbU")
        //          )),
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
//      println(contentAsString(resp))
      val congressList = Json.parse(contentAsString(resp)).validate[List[CongressVO]].get
      congressList.length mustBe 1
    }

    "return first congress with all the fields non-empty" in {
      val resp = route(app, FakeRequest(GET, "/congresses/id/1", fakeJsonHeaders, "")).get
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")

      val jsonRes = Json.parse(contentAsString(resp))
      val bindForm = CongressVO.congressVOForm.bind(jsonRes)
      val res = jsonRes.validate[CongressVO].get
    }

    "Insert new congress and return a JSON valid response" in {
      val newCongress = CongressVO(0, "Congreso1", "Ponencia congreso 1", "Lugo", "Spain", "08/10/2016", "09/10/2016", true, None)

      val resp = route(
        app,
        FakeRequest(
          POST,
          "/congresses/add",
          fakeJsonHeaders,
          Json.toJson(newCongress))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp))
      assert(json.\("res").as[String] !== "error")
    }

    "Deleting a congress with an ID 2 will return a response OK" in {
      val resp = route(
        app,
        FakeRequest(
          DELETE,
          "/congresses/delete/2",
          fakeJsonHeaders,
          Json.toJson(""))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      val json = Json.parse(contentAsString(resp))
      val resCode = json.as[JsObject].\("res").get
      resCode.as[String] mustEqual "OK"
    }

    "return 1 congress after the add and the delete" in {
      val resp = route(app, FakeRequest(
        GET,
        "/congresses/all",
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val congressList = Json.parse(contentAsString(resp)).validate[List[CongressVO]].get
      congressList.length mustBe 1
    }
  }
}