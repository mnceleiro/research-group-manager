package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.libs.json._

import models.entities.User
import services.UserService
import scala.concurrent.Future
import scala.concurrent.Await
import scala.concurrent.duration._
import play.api.db.slick.DatabaseConfigProvider

class UserController @Inject()(dbConfigProvider: DatabaseConfigProvider) extends Controller {
  def getAll = Action {
    val users = UserService.listAll
    implicit val userWrites = Json.writes[User]
    
    val userList = Await.result(users, 3 second)
    Ok(Json.toJson(userList))
  }

//  def add() = Action { implicit request =>
//    UserForm.form.bindFromRequest.fold(
//      // if any error in submitted data
//      errorForm => Ok(views.html.index(errorForm, Seq.empty[User])),
//      data => {
//        val newUser = User(0, data.firstName, data.lastName, data.mobile, data.email)
//        val res = UserService.addUser(newUser)
//        Redirect(routes.ApplicationController.index())
//      })
//  }
}