package utils

import authentikat.jwt.JwtHeader
import authentikat.jwt.JwtClaimsSet
import authentikat.jwt.JsonWebToken
import play.api.libs.json.JsObject
import play.api.libs.json.Json

class JWTUtils {
  val JwtSecretKey = "P3R;kC41?+,7|,p"
  val JwtSecretAlgo = "HS256"
  
  def createToken(payload: String): String = {
    val header = JwtHeader(JwtSecretAlgo)
    val claimsSet = JwtClaimsSet(payload)

    JsonWebToken(header, claimsSet, JwtSecretKey)
  }

  def isValidToken(jwtToken: String): Boolean = {
//    println(JsonWebToken.validate(jwtToken, JwtSecretKey))
//    println(createToken("{ \"id\": 1, \"email\": \"mnceleiro@esei.uvigo.es\", \"password\": \"1234\", \"firstName\": \"Marcos\", \"lastName\": \"Nunez Celeiro\", \"signatureName\": \"Marcos Nunez Celeiro\", \"address\": \"Calle Empanada de Zorza n\u00BA5\", \"phone\": \"9825312121\" }"))
    JsonWebToken.validate(jwtToken, JwtSecretKey)
  }

  def decodePayload(jwtToken: String): Option[String] = {
//    println(jwtToken)
    jwtToken match {
      case JsonWebToken(header, claimsSet, signature) => /*println(claimsSet.asJsonString);*/ Option(claimsSet.asJsonString)
      case _ => None
    }
  }
}

object JWTUtils extends JWTUtils