package controllers

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.test._
import play.api.test.Helpers._

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import play.api.libs.json.JsObject
import models.entities.Book
import vos.BookVO

class BookControllerSpec extends AcceptanceSpec[Book] with BeforeAndAfter {
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

  "Book controller" should {

    "return 1 books" in {
      val resp = route(app, FakeRequest(
        GET,
        "/books/all",
        fakeJsonHeaders,
        ""
      )).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      val list = Json.parse(contentAsString(resp)).validate[List[BookVO]].get
      list.length mustBe 1
    }

    "return first book with all the fields form valid" in {
      val resp = route(app, FakeRequest(GET, "/books/with-authors/id/1", fakeJsonHeaders, "")).get
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")

      val jsonData = Json.parse(contentAsString(resp))
      val bindForm = BookVO.bookVOForm.bind(jsonData)
      val data = jsonData.validate[BookVO].get
    }

    "Insert new book and return a JSON valid response" in {
      val element = BookVO(None, "Libro1", "Libro1", "Libro1", Option("23:2"), None, None, Option(2015), "Editorial1", "Ourense", Some("28372LK2"), 2, Seq())

      val resp = route(
        app,
        FakeRequest(
          POST,
          "/books/add",
          fakeJsonHeaders,
          Json.toJson(element))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp))
      assert(json.\("res").as[String] !== "error")
    }

    "Deleting a book with an ID 2 will return a response OK" in {
      val resp = route(
        app,
        FakeRequest(
          DELETE,
          "/books/delete/2",
          fakeJsonHeaders,
          Json.toJson(""))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      val json = Json.parse(contentAsString(resp))
      val resCode = json.as[JsObject].\("res").get
      resCode.as[String] mustEqual "OK"
    }

    "return 1 book after the add and the delete" in {
      val resp = route(app, FakeRequest(
        GET,
        "/books/all",
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val list = Json.parse(contentAsString(resp)).validate[List[BookVO]].get
      list.length mustBe 1
    }
  }
}