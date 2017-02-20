package models.entities

import play.api.libs.json.Writes
import play.api.data.Form
import play.api.libs.json.Json

trait BaseEntity {
  val id: Long
}