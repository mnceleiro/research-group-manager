package models.entities

import play.api.i18n.{MessagesApi, Messages, I18nSupport}
import play.api.libs.json.Json
import play.api.libs.json.JsValue

object JsonMessage {
  def resOK(data: JsValue) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: JsValue) = Json.obj("res" -> "error") ++ Json.obj("description" -> error)
  
  def resOK(data: String) = Json.obj("res" -> "OK") ++ Json.obj("data" -> data)
  def resKO(error: String) = Json.obj("res" -> "error") ++ Json.obj("description" -> error)
}