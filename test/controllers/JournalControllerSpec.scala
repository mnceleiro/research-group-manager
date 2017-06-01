package controllers

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.test._
import play.api.test.Helpers._

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import play.api.libs.json.JsObject
import models.entities.Journal
import vos.JournalVO

class JournalControllerSpec extends AcceptanceSpec[Journal] with BeforeAndAfter {

  "Journal controller" should {

    "return 1 journals" in {
      val resp = route(app, FakeRequest(
        GET,
        "/journals/all",
        fakeJsonHeaders,
        ""
      )).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      val list = Json.parse(contentAsString(resp)).validate[List[JournalVO]].get
      list.length mustBe 1
    }

    "return first journal with all the fields form valid" in {
      val resp = route(app, FakeRequest(GET, "/journals/with-authors/id/1", fakeJsonHeaders, "")).get
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")

      val jsonData = Json.parse(contentAsString(resp))
      val bindForm = JournalVO.journalVOForm.bind(jsonData)
      val data = jsonData.validate[JournalVO].get
    }

    "Insert new journal and return a JSON valid response" in {
      val element = JournalVO(None, "Revista1", "Revista1", "Revista1", Option("23:2"), None, None, "02/10/2017", "Editorial1", "Ourense", Some("28372LK2"), 2, Seq())

      val resp = route(
        app,
        FakeRequest(
          POST,
          "/journals/add",
          fakeJsonHeaders,
          Json.toJson(element))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp))
      assert(json.\("res").as[String] !== "error")
    }

    "Deleting a journal with an ID 2 will return a response OK" in {
      val resp = route(
        app,
        FakeRequest(
          DELETE,
          "/journals/delete/2",
          fakeJsonHeaders,
          Json.toJson(""))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      val json = Json.parse(contentAsString(resp))
      val resCode = json.as[JsObject].\("res").get
      resCode.as[String] mustEqual "OK"
    }

    "return 1 journal after the add and the delete" in {
      val resp = route(app, FakeRequest(
        GET,
        "/journals/all",
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val list = Json.parse(contentAsString(resp)).validate[List[JournalVO]].get
      list.length mustBe 1
    }
  }
}