package models.entities

case class Journal(
    id: Option[Long], code: String, title: String, journal: String, 
    volume: String, startPage: Long, endPage: Long, date: String, 
    editorial: String, place: String, issn: String, status: Long    
)