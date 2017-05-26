package models.entities

import play.api.libs.json.Json

case class PublicationStatus(id: Long, description: String)

object PublicationStatus {
  implicit var publicationStatusReads = Json.reads[PublicationStatus]
  implicit var publicationStatusWrites = Json.writes[PublicationStatus]
  implicit var publicationStatusFormat = Json.format[PublicationStatus]
}