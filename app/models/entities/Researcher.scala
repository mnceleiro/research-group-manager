package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.functional.syntax.toFunctionalBuilderOps
import play.api.libs.functional.syntax.unlift
import play.api.libs.json.Writes
import play.api.libs.json.__
import play.api.data.Mapping
import play.api.libs.json.Json

final case class Researcher(id: Long, firstName: String, lastName: String, address: String, phone: String, userId: Long) extends BaseEntity
final case class ResearcherWithUser(researcher: Researcher, user: User)

object Researcher {
  val researcherMapping: Mapping[Researcher] = mapping(
    "id" -> longNumber,
    "firstName" -> nonEmptyText,
    "lastName" -> nonEmptyText,
    "address" -> nonEmptyText,
    "phone" -> nonEmptyText,
    "userId" -> longNumber
  )(Researcher.apply)(x => Some(x.id, x.firstName, x.lastName, x.address, x.phone, x.userId))

  implicit val researcherForm: Form[Researcher] = Form(researcherMapping)
  implicit val researcherWithUserWrites = Json.writes[Researcher]
  implicit val researcherWithUserReads = Json.reads[Researcher]  
}

object ResearcherWithUser {
  val resUsMapping = mapping(
    "researcher" -> Researcher.researcherMapping,
    "user" -> User.userMapping
  )(ResearcherWithUser.apply)(x => Some(x.researcher, x.user))

  implicit val resUsForm: Form[ResearcherWithUser] = Form(resUsMapping)
  implicit val researcherWithUserWrites = Json.writes[ResearcherWithUser]
  implicit val researcherWithUserReads = Json.reads[ResearcherWithUser]  
}
    