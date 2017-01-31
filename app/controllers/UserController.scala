package controllers

import javax.inject._
import play.api._
import play.api.mvc._

import models.entities.User

class UserController @Inject() extends Controller {
//  def index = Action {
//    val users = UserService.listAll
//    Ok(views.html.index(UserForm.form, users))
//  }

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