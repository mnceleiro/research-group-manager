package models.repositories

import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import org.scalatest.BeforeAndAfter
import org.scalatestplus.play.{OneAppPerSuite, PlaySpec}
import play.api.libs.concurrent.Execution.Implicits._
import scala.util.Success
import scala.util.Failure
import models.entities.Researcher

import play.api.db.DBApi
import play.api.db.evolutions.Evolutions
import org.scalatest.BeforeAndAfterAll


class ResearcherRepositorySpec extends PlaySpec with OneAppPerSuite with BeforeAndAfterAll {

  val researcherRepo = app.injector.instanceOf[ResearcherRepository]
  val dbApi = app.injector.instanceOf[DBApi]

  
  override def beforeAll = {
    Evolutions.cleanupEvolutions(dbApi.database("default"))
    Evolutions.applyEvolutions(dbApi.database("default"))
  }
  
  override def afterAll = {
//    Evolutions.cleanupEvolutions(dbApi.database("default"))
  }

  "ResearcherRepository" should {

    "return 5 researchers" in {
      val list = researcherRepo.listAll

      val sizeFuture = list.map(_.size)
      sizeFuture onSuccess {
        case size: Int => size mustBe 5
      }
    }

    "return Oscar Cañellas as researcher" in {
      researcherRepo.get(2).onComplete {
        case Success(res) => {
          val r = res.get
    		  r.id mustBe 2
        	r.firstName mustBe "Oscar"
        	r.lastName mustBe "Cañellas"
          r.signatureName mustBe "Oscar Mixwell Cañellas"
          r.address mustBe "Calle Alcantara nº12"
          r.email mustBe "ocanellas@gmail.com"
        }
        case Failure(e) => throw e
      }
    }

    "add Alan Mathison Turing as Researcher" in {
      
      val res = Researcher(0, "aturing@paddington.com", Option("1234"), "Alan", "Mathison Turing", "Alan Mathison-Turing", "Paddington 18", "9825312123", 1)
//      researcherRepo.save(res) onSuccess {
//        case r: Researcher => {
//    		  r.id mustBe 6
//    		  r.email mustBe "aturing@paddington.com"
//    		  r.password mustBe "1234"
//        	r.firstName mustBe "Alan"
//        	r.lastName mustBe "Mathison Turing"
//          r.signatureName mustBe "Alan Mathison-Turing"
//          r.address mustBe "Paddington 18"
//          r.phone mustBe "9825312123"
//        }
//      }
    }
  
//    "update Marcos Nunez address and email" in {
//      researcherRepo.update(
//          Researcher(
//            1, 
//            "markius1@gmail.com", 
//            "1234", 
//            "Marcos", 
//            "Nunez Celeiro", 
//            "Marcos Nunez Celeiro", 
//            "C/ Curros Enriquez 121, Sarria (Lugo)", 
//            "9825312123"
//        )
//      ) onComplete {
//          case Success(rf) => researcherRepo.get(1).onSuccess {
//          case resOpt: Option[Researcher] => {
//            val r = resOpt.getOrElse(throw new NoSuchElementException)
//            
//      		  r.email mustBe "markius1@gmail.com"
//            r.address mustBe "C/ Curros Enriquez 121, Sarria (Lugo)"
//          }
//        }
//      }
//      
//    }
    
    "update Marcos Nunez address and email" in {
      researcherRepo.update(
          Researcher(
            1, 
            "markius1@gmail.com", 
            Option("1234"), 
            "Marcos", 
            "Nunez Celeiro", 
            "Marcos Nunez Celeiro", 
            "C/ Curros Enriquez 1211, Sarria (Lugo)", 
            "9825312123",
            1
        )
      ).onSuccess({
        case r: Researcher => {
          r.email mustBe "markius1@gmail.com"
          r.address mustBe "C/ Curros Enriquez 1211, Sarria (Lugo)"
        }
      })
    }
  }
}
