package utils

import org.mindrot.jbcrypt.BCrypt

object Password {
  val workload = 12
  
	def hashPassword(password_plaintext: String) : Option[String] = {
		var salt = BCrypt.gensalt(workload);
		Option(BCrypt.hashpw(password_plaintext, salt))
	}
  
	def checkPassword(password_plaintext: String, stored_hash: String): Boolean = {
  	var password_verified = false
  
  	if(null == stored_hash || !stored_hash.startsWith("$2a$"))
  		throw new java.lang.IllegalArgumentException("Invalid hash provided for comparison")
  
  	BCrypt.checkpw(password_plaintext, stored_hash)
	}
}