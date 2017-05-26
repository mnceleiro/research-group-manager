package models.entities

import play.api.i18n.{MessagesApi, Messages, I18nSupport}
import play.api.libs.json.Json
import play.api.libs.json.JsValue

//case class HttpMessage(key: String, message: String)

object JsonMessage {
//  implicit val jsonFormat = Json.format[HttpMessage]
//  implicit val jsonWrites = Json.writes[HttpMessage]
  
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("description" -> error)

//  def apply(key: String)(implicit messages: Messages): HttpMessage = {
//    HttpMessage(key, Messages(key))
//  }
}