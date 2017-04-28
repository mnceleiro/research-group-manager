package controllers

import com.google.inject.Inject

import play.api.mvc.Controller

class ProjectConroller @Inject()(
    projectRepo: Projectrepository,
    auth: SecuredAuthenticator
    ) extends Controller {
  
}