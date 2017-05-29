package controllers

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.test._
import play.api.test.Helpers._

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import play.api.libs.json.JsObject
import models.entities.Author
import vos.AuthorVO

class AuthorControllerSpec extends AcceptanceSpec[Author] with BeforeAndAfter {

  "Author controller" should {

    "return 6 authors" in {
      val resp = route(app, FakeRequest(
        GET,
        "/authors/all",
        fakeJsonHeaders,
        ""
      )).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      val list = Json.parse(contentAsString(resp)).validate[List[AuthorVO]].get
      list.length mustBe 6
    }

    "return first author with all the fields form valid" in {
      val resp = route(app, FakeRequest(GET, "/authors/with-entities/id/1", fakeJsonHeaders, "")).get
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")

      val jsonData = Json.parse(contentAsString(resp))
      val bindForm = AuthorVO.authorForm.bind(jsonData)
      val data = jsonData.validate[AuthorVO].get
    }

    "Insert new author and return a JSON valid response" in {
      val element = AuthorVO(0, "email1@email.com", "Linus Torvals", None)

      val resp = route(
        app,
        FakeRequest(
          POST,
          "/authors/add",
          fakeJsonHeaders,
          Json.toJson(element))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp))
      assert(json.\("res").as[String] !== "error")
    }

    "Deleting a author with an ID 7 will return a response OK" in {
      val resp = route(
        app,
        FakeRequest(
          DELETE,
          "/authors/delete/7",
          fakeJsonHeaders,
          Json.toJson(""))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      val json = Json.parse(contentAsString(resp))
      val resCode = json.as[JsObject].\("res").get
      resCode.as[String] mustEqual "OK"
    }

    "return 6 authors after the add and the delete" in {
      val resp = route(app, FakeRequest(
        GET,
        "/authors/all",
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val list = Json.parse(contentAsString(resp)).validate[List[AuthorVO]].get
      list.length mustBe 6
    }
  }
}