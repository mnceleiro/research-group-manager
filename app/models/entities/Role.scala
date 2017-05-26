package models.entities

import play.api.libs.json.Json

final case class Role(id: Long, description: String)

object Role {
  implicit var roleReads = Json.reads[Role]
  implicit var roleWrites = Json.writes[Role]
  implicit var roleFormat = Json.format[Role]
}