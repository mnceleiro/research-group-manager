package controllers

import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import models.entities.BaseEntity
import org.scalatest.BeforeAndAfterAll
import org.scalatest.BeforeAndAfter
import play.api.db.evolutions.Evolutions
import play.api.db.DBApi
import play.api.test._

import play.api.db.Database
import play.api.test.Helpers._
import play.api.libs.json._

trait AcceptanceSpec[T] extends PlaySpec with OneAppPerSuite with BeforeAndAfterAll with BeforeAndAfter {
  val dbApi = app.injector.instanceOf[DBApi]
  
  var tokenString: String = null
  var fakeTextHeaders: FakeHeaders = null
  var fakeJsonHeaders: FakeHeaders = null
  
//  var tokenStringNoAuth: String = null
//  var fakeTextHeadersNoAuth: FakeHeaders = null
//  var fakeJsonHeadersNoAuth: FakeHeaders = null
    
  override def beforeAll = {
    Evolutions.cleanupEvolutions(dbApi.database("default"))
    Evolutions.applyEvolutions(dbApi.database("default"))
  }
  
  override def afterAll = {
//    Evolutions.cleanupEvolutions(dbApi.database("test"))
  }
  
    before {
    val respAdmin = route(app, FakeRequest(
      POST, "/users/login",
      FakeHeaders(Seq("content-type" -> "application/json")),
      Json.parse("""{"email":"mnceleiro@esei.uvigo.es", "password":"1234"}"""))).get
      
    val respNoAuthorization = route(app, FakeRequest(
      POST, "/users/login",
      FakeHeaders(Seq("content-type" -> "application/json")),
      Json.parse("""{"email":"dmritchie@yahoo.es", "password":"1234"}"""))).get

    this.tokenString = "Bearer " + Json.parse(contentAsString(respAdmin)).as[JsObject].\("token").get.as[String]
//    this.tokenStringNoAuth = "Bearer " + Json.parse(contentAsString(respAdmin)).as[JsObject].\("token").get.as[String]

//    this.fakeTextHeaders = FakeHeaders(Seq(
//      ("content-type" -> "text/plain"),
//      ("Authorization", this.tokenString)))
//
//    this.fakeJsonHeaders = FakeHeaders(Seq(
//      ("content-type" -> "application/json"),
//      ("Authorization", this.tokenString)))
//      
//    this.fakeTextHeadersNoAuth = FakeHeaders(Seq(
//      ("content-type" -> "text/plain"),
//      ("Authorization", this.tokenString)))
//
//    this.fakeJsonHeadersNoAuth = FakeHeaders(Seq(
//      ("content-type" -> "application/json"),
//      ("Authorization", this.tokenString)))
  }

  after {

  }
}