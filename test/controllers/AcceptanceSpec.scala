package controllers

import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.libs.json.Json
import models.entities.BaseEntity
import org.scalatest.BeforeAndAfterAll
import play.api.db.evolutions.Evolutions
import play.api.db.DBApi

import play.api.db.Database
import play.api.db.evolutions.{DatabaseEvolutions, EvolutionsReader, ThisClassLoaderEvolutionsReader}

trait AcceptanceSpec[T] extends PlaySpec with OneAppPerSuite with BeforeAndAfterAll {
  val dbApi = app.injector.instanceOf[DBApi]
    
  override def beforeAll = {
    Evolutions.cleanupEvolutions(dbApi.database("default"))
    Evolutions.applyEvolutions(dbApi.database("default"))
  }
  
  override def afterAll = {
//    Evolutions.cleanupEvolutions(dbApi.database("test"))
  }
}