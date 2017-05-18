package vos

case class BookVO(
    id: Option[Long], code: String, title: String, book: String, 
    volume: String, startPage: Long, endPage: Long, year: Long, 
    editorial: String, place: String, isbn: String, status: Long    
)