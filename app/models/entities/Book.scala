package models.entities

case class Book(
    id: Option[Long], code: String, title: String, book: String, 
    volume: Option[String], startPage: Option[Long], endPage: Option[Long], year: Option[Long], 
    editorial: String, place: String, isbn: Option[String], statusId: Long
)