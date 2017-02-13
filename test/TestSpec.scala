import org.scalatestplus.play.OneAppPerTest
import org.scalatest.BeforeAndAfterAll
import org.scalatest.Suite
import com.google.inject.Injector
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.Mode
import java.io.File
import play.api.Environment
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite

//import org.scalatest._
//import org.scalatestplus.play._
//import play.api.test._
//import play.api.test.Helpers._
//import play.api.inject.guice.GuiceApplicationBuilder
//import models.repositories.ResearcherRepository
//import scala.concurrent.Future
//import play.api.libs.concurrent.Execution.Implicits._
//import com.typesafe.config.ConfigFactory
//import java.io.File
//import play.api.Configuration
//import play.api.Application
//
//class TestSpec extends PlaySpec with OneAppPerSuite {
//  
//  val myConfigFile = new File("conf/application.conf")
//  val parsedConfig = ConfigFactory.parseFile(myConfigFile)
//  val configuration = ConfigFactory.load(parsedConfig)
//
//  implicit override lazy val app: Application = new GuiceApplicationBuilder()
//    .overrides(bind[Configuration]
//    .toInstance(Configuration(configuration)))
//    .build()
//  
////  implicit override lazy val app = new GuiceApplicationBuilder().configure(Map("ehcacheplugin" -> "disabled")).build()
//  var researcherRepo = app.injector.instanceOf(classOf[ResearcherRepository])
//
//  "ResearcherRepository" should {
//
//    "return 5 researchers" in {
//      val list = researcherRepo.listAll
//      
//      val sizeFuture = list.map(_.size)
//      sizeFuture onSuccess {
//        case size: Int => println(size); size mustBe 5
//      }
//    }
//
//  }
//
//  
////  "CountController" should {
////
////    "return an increasing count" in {
////      contentAsString(route(app, FakeRequest(GET, "/count")).get) mustBe "0"
////      contentAsString(route(app, FakeRequest(GET, "/count")).get) mustBe "1"
////      contentAsString(route(app, FakeRequest(GET, "/count")).get) mustBe "2"
////    }
////
////  }
//
//}

import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.Application
import play.api.db.Database
import play.api.db.evolutions.{Evolution, Evolutions, SimpleEvolutionsReader}
import play.api.inject.guice.GuiceApplicationBuilder
import models.repositories.ResearcherRepository
import play.api.libs.concurrent.Execution.Implicits._

class TestSpec extends PlaySpec with OneAppPerSuite with BeforeAndAfter {
 
//  implicit override lazy val app: Application = new GuiceApplicationBuilder()
//    .configure("db.default.url" -> sys.env.getOrElse("DB_TEST_URL", "jdbc:mysql://localhost:3306/my_test_db?useSSL=false"))
//    .build
  before {

  }

  "ResearcherRepository" should {

    "return 5 researchers" in {
      val researcherRepo = app.injector.instanceOf[ResearcherRepository]
      val list = researcherRepo.listAll

      val sizeFuture = list.map(_.size)
      sizeFuture onSuccess {
        case size: Int => println(size); size mustBe 5
      }
    }

  }
 
  after {

  }
}
