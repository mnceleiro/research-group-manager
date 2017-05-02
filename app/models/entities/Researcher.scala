package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.functional.syntax.unlift
import play.api.libs.json.Writes
import play.api.libs.json.__
import play.api.data.Mapping

final case class Researcher(id: Long, firstName: String, lastName: String, address: String, phone: String, userId: Long) extends BaseEntity
final case class ResearcherWithUser(researcher: Researcher, user: User)

object ResearcherWithUser {
  //  val researcherForm: Form[ResearcherWithUser] = Form(
  //    mapping(
  //        "researcher" -> object
  //    )(ResearcherWithUser.apply)(x => Some(x.id, x.firstName, x.lastName, x.address, x.phone))
  //  )
  val resUsMapping = mapping(
    "researcher" -> Researcher.researcherMapping,
    "user" -> User.userMapping
  )(ResearcherWithUser.apply)(x => Some(x.researcher, x.user))

  val resUsForm: Form[ResearcherWithUser] = Form(resUsMapping)
}

object Researcher {
  //      implicit val ResearcherWrites: Writes[Researcher] = (
  //      (__ \ "id").write[Long] and
  //      (__ \ "email").write[String] and
  //      (__ \ "password").write[Option[String]] and
  //      (__ \ "firstName").write[String] and
  //      (__ \ "lastName").write[String] and
  //      (__ \ "signatureName").write[String] and
  //      (__ \ "address").write[String] and
  //      (__ \ "phone").write[String] and
  //      (__ \ "role").write[Long]
  //  )(unlift(Researcher.unapply))

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
  val researcherMapping: Mapping[Researcher] = mapping(
    "id" -> longNumber,
    "firstName" -> nonEmptyText,
    "lastName" -> nonEmptyText,
    "address" -> nonEmptyText,
    "phone" -> nonEmptyText,
    "userId" -> longNumber
  )(Researcher.apply)(x => Some(x.id, x.firstName, x.lastName, x.address, x.phone, x.userId))

  val researcherForm: Form[Researcher] = Form(researcherMapping)
}
    