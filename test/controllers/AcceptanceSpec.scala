package controllers

import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.OneAppPerSuite
import play.api.libs.json.Json
import models.entities.BaseEntity


trait AcceptanceSpec[T <: BaseEntity] extends PlaySpec with OneAppPerSuite {

}