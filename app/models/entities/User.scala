package models.entities

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Mapping
import play.api.libs.json.Json

case class User(id: Long, email: String, password: Option[String], admin: Boolean, access: Boolean)

object User {
  val userMapping: Mapping[User] = mapping(
    "id" -> longNumber,
    "email" -> email,
    "password" -> optional(text),
    "admin" -> boolean,
    "access" -> boolean
  )(User.apply)(x => Some(x.id, x.email, x.password, x.admin, x.access))
    
  implicit val userForm: Form[User] = Form(userMapping)
  implicit val userWrites = Json.writes[User]
  implicit val userReads = Json.reads[User]
}