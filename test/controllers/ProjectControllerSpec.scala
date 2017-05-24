//package controllers
//
//import org.scalatest.BeforeAndAfter
//import org.scalatestplus.play.PlaySpec
//import org.scalatestplus.play.OneAppPerSuite
//import play.api.test._
//import play.api.test.Helpers._
//
//import play.api.libs.concurrent.Execution.Implicits._
//import play.api.libs.json.Json
//import play.api.libs.json.JsObject
//import vos.ProjectVO
//import models.entities.Project
//
//class ProjectControllerSpec extends AcceptanceSpec[Project] with BeforeAndAfter {
//
//  implicit var pReads = Json.reads[Project]
//  implicit var pWrites = Json.writes[Project]
//  implicit var pFormat = Json.format[Project]
//  
//  implicit var pReadsVO = Json.reads[ProjectVO]
//  implicit var pWritesVO = Json.writes[ProjectVO]
//  implicit var pFormatVO = Json.format[ProjectVO]
//  
//  var tokenString: String = null
//  var fakeTextHeaders: FakeHeaders = null
//  var fakeJsonHeaders: FakeHeaders = null
//
//  before {
//    val resp = route(app, FakeRequest(
//      POST, "/users/login",
//      FakeHeaders(Seq("content-type" -> "application/json")),
//      Json.parse("""{"email":"mnceleiro@esei.uvigo.es", "password":"1234"}"""))).get
//
//    this.tokenString = "Bearer " + Json.parse(contentAsString(resp)).as[JsObject].\("token").get.as[String]
//
//    this.fakeTextHeaders = FakeHeaders(Seq(
//      ("content-type" -> "text/plain"),
//      ("Authorization", this.tokenString)))
//
//    this.fakeJsonHeaders = FakeHeaders(Seq(
//      ("content-type" -> "application/json"),
//      ("Authorization", this.tokenString)))
//  }
//
//  after {
//
//  }
//
//  "Project controller" should {
//
//    "return 1 projects" in {
//      val resp = route(app, FakeRequest(
//        GET,
//        "/projects/all",
//        //          FakeHeaders(Seq(
//        //              ("content-type" -> "text/plain"), 
//        //              ("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibW5jZWxlaXJvQGVzZWkudXZpZ28uZXMiLCJnZW5lcmF0ZWQiOjE0OTE4OTg5MjY3MTB9.XewJTpzoZKcEdABq0G7o-p82xfES1aCngSR0XDzkcbUBearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoibW5jZWxlaXJvQGVzZWkudXZpZ28uZXMiLCJnZW5lcmF0ZWQiOjE0OTE4OTg5MjY3MTB9.XewJTpzoZKcEdABq0G7o-p82xfES1aCngSR0XDzkcbU")
//        //          )),
//        fakeJsonHeaders,
//        "")).get
//
//      status(resp) mustBe OK
//      contentType(resp) mustBe Some("application/json")
//      val projectList = Json.parse(contentAsString(resp)).validate[List[ProjectVO]].get
//      projectList.length mustBe 1
//    }
//
//    "return first project with all the fields non-empty" in {
//      val resp = route(app, FakeRequest(GET, "/projects/id/1", fakeJsonHeaders, "")).get
//      status(resp) mustBe OK
//      contentType(resp) mustBe Some("application/json")
//
//      val jsonRes = Json.parse(contentAsString(resp))
//      val bindForm = ProjectVO.projectVOForm.bind(jsonRes)
//      val res = jsonRes.validate[ProjectVO].get
//    }
//
//    "Insert new project and return a JSON valid response" in {
//      val newProject = ProjectVO(0, "1L442K", "Project 1", true, 
//          "08/10/2015", "08/10/2016", 100000, Option(4L)
//      )
//
//      val resp = route(
//        app,
//        FakeRequest(
//          POST,
//          "/projects/add",
//          fakeJsonHeaders,
//          Json.toJson(newProject))).get
//
//      contentType(resp) mustBe Some("application/json")
//      status(resp) mustBe OK
//      
//      val json = Json.parse(contentAsString(resp))
//      assert(json.\("res").as[String] !== "error")
//    }
//
//    "Deleting a project with an ID 2 will return a response OK" in {
//      val resp = route(
//        app,
//        FakeRequest(
//          DELETE,
//          "/projects/delete/2",
//          fakeJsonHeaders,
//          Json.toJson(""))).get
//
//      contentType(resp) mustBe Some("application/json")
//      status(resp) mustBe OK
//
//      val json = Json.parse(contentAsString(resp))
//      val resCode = json.as[JsObject].\("res").get
//      resCode.as[String] mustEqual "OK"
//    }
//
//    "return 2 projects after the add and the delete" in {
//      val resp = route(app, FakeRequest(
//        GET,
//        "/projects/all",
//        fakeJsonHeaders,
//        "")).get
//
//      status(resp) mustBe OK
//      contentType(resp) mustBe Some("application/json")
//      
//      val projectList = Json.parse(contentAsString(resp)).validate[List[ProjectVO]].get
//      projectList.length mustBe 1
//    }
//  }
//}