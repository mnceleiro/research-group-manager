package controllers

import com.google.inject.Inject
import play.api.mvc.Controller

import models.repositories.ProjectRepository

class ProjectConroller @Inject()(
    projectRepo: ProjectRepository,
    auth: SecuredAuthenticator
    ) extends Controller {
  
}