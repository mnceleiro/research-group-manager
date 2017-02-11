package models.entities

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import play.api.data.Form
import play.api.data.Forms._
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import play.api.libs.json._ 
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._


final case class Researcher(id: Long,  email: String, firstName: String, lastName: String, signatureName: String, address: String, phone: String)

object Researcher {
      implicit val ResearcherWrites: Writes[Researcher] = (
      (__ \ "id").write[Long] and
      (__ \ "email").write[String] and
      (__ \ "firstName").write[String] and
      (__ \ "lastName").write[String] and
      (__ \ "signatureName").write[String] and
      (__ \ "address").write[String] and
      (__ \ "phone").write[String]
  )(unlift(Researcher.unapply))
  
    implicit val ResearcherReads = {
      (__ \ "id").read[Long] and
      (__ \ "email").read[String] and
      (__ \ "firstName").read[String] and
      (__ \ "lastName").read[String] and
      (__ \ "signatureName").read[String] and
      (__ \ "address").read[String] and
      (__ \ "phone").read[String]
  }
  
  val researcherForm: Form[Researcher] = Form(
      mapping(
          "id" -> longNumber,
          "email" -> nonEmptyText,
          "firstName" -> nonEmptyText,
          "lastName" -> nonEmptyText,
          "signatureName" -> nonEmptyText,
          "address" -> nonEmptyText,
          "phone" -> nonEmptyText
      )(Researcher.apply)(x => Some(x.id, x.email, x.firstName, x.lastName, x.signatureName, x.address, x.phone))
  )
}
    