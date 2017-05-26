package models.entities

import play.api.libs.json.Json

final case class CongressType(id: Long, description: String)

object CongressType {
  implicit var congressTypeReads = Json.reads[CongressType]
  implicit var congressTypeWrites = Json.writes[CongressType]
  implicit var congressTypeFormat = Json.format[CongressType]
}