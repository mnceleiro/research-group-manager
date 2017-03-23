package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.functional.syntax.unlift
import play.api.libs.json.Writes
import play.api.libs.json.__


final case class Researcher(id: Long,  email: String, password: String, firstName: String, lastName: String, signatureName: String, address: String, phone: String) extends BaseEntity

object Researcher {
      implicit val ResearcherWrites: Writes[Researcher] = (
      (__ \ "id").write[Long] and
      (__ \ "email").write[String] and
      (__ \ "password").write[String] and
      (__ \ "firstName").write[String] and
      (__ \ "lastName").write[String] and
      (__ \ "signatureName").write[String] and
      (__ \ "address").write[String] and
      (__ \ "phone").write[String]
  )(unlift(Researcher.unapply))
  
//    implicit val ResearcherReads = {
//      (__ \ "id").read[Long] and
//      (__ \ "email").read[String] and
//      (__ \ "password").read[String] and
//      (__ \ "firstName").read[String] and
//      (__ \ "lastName").read[String] and
//      (__ \ "signatureName").read[String] and
//      (__ \ "address").read[String] and
//      (__ \ "phone").read[String]
//  }
  
  val researcherForm: Form[Researcher] = Form(
      mapping(
          "id" -> longNumber,
          "email" -> email,
          "password" -> text,
          "firstName" -> nonEmptyText,
          "lastName" -> nonEmptyText,
          "signatureName" -> nonEmptyText,
          "address" -> nonEmptyText,
          "phone" -> nonEmptyText
      )(Researcher.apply)(x => Some(x.id, x.email, x.password, x.firstName, x.lastName, x.signatureName, x.address, x.phone))
  )
}
    