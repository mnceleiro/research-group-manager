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
    JsonWebToken.validate(jwtToken, JwtSecretKey)
  }

  def decodePayload(jwtToken: String): Option[String] = {
    jwtToken match {
      case JsonWebToken(header, claimsSet, signature) => Option(claimsSet.asJsonString)
      case _ => None
    }
  }
}

object JWTUtils extends JWTUtils