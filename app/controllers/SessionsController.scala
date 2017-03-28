package controllers

import play.api.mvc.Controller
import javax.inject._
import play.api.mvc._
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits._
import utils.Password

import com.github.t3hnar.bcrypt._

class SessionsController @Inject extends Controller {
  def login(user: String, password: String) = Action.async {
    // TODO: Convert to base64
    Password.hashPassword(password)
    
    // TODO: Check equals password
    
    // TODO: Return OK response with user:password encoded in a cookie
    Future.apply(Ok("").withCookies(Cookie("token", "token")))
  }
}