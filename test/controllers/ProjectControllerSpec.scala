package controllers

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.test._
import play.api.test.Helpers._

import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json.Json
import play.api.libs.json.JsObject
import vos.ProjectVO
import models.entities.Project

class ProjectControllerSpec extends AcceptanceSpec[Project] {

  "Project controller" should {

    "return 3 projects" in {
      val resp = route(app, FakeRequest(
        GET,
        "/projects/all",
        fakeJsonHeaders,
        ""
      )).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      val projectList = Json.parse(contentAsString(resp)).validate[List[ProjectVO]].get
      projectList.length mustBe 3
    }

    "return first project with all the fields non-empty" in {
      val resp = route(app, FakeRequest(GET, "/projects/with-authors/id/1", fakeJsonHeaders, "")).get
      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")

      val jsonRes = Json.parse(contentAsString(resp))
      val bindForm = ProjectVO.projectVOForm.bind(jsonRes)
      val res = jsonRes.validate[ProjectVO].get
    }

    "Insert new project and return a JSON valid response" in {
      val newProject = ProjectVO(0, "1L442K", "Project 1", true, Option("08/10/2015"), Option("08/10/2016"), Option(100000), Option(4L), Seq()
      )

      val resp = route(
        app,
        FakeRequest(
          POST,
          "/projects/add",
          fakeJsonHeaders,
          Json.toJson(newProject))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK
      
      val json = Json.parse(contentAsString(resp))
      assert(json.\("res").as[String] !== "error")
    }

    "Deleting a project with an ID 3 will return a response OK" in {
      val resp = route(
        app,
        FakeRequest(
          DELETE,
          "/projects/delete/3",
          fakeJsonHeaders,
          Json.toJson(""))).get

      contentType(resp) mustBe Some("application/json")
      status(resp) mustBe OK

      val json = Json.parse(contentAsString(resp))
      val resCode = json.as[JsObject].\("res").get
      resCode.as[String] mustEqual "OK"
    }

    "return 3 projects after the add and the delete" in {
      val resp = route(app, FakeRequest(
        GET,
        "/projects/all",
        fakeJsonHeaders,
        "")).get

      status(resp) mustBe OK
      contentType(resp) mustBe Some("application/json")
      
      val projectList = Json.parse(contentAsString(resp)).validate[List[ProjectVO]].get
      projectList.length mustBe 3
    }
  }
}