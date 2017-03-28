//package services
//
//import models.repositories.SessionsRepository
//import com.google.inject.Inject
//
//class SessionsService @Inject()(repo: SessionsRepository) {
//  /**
//   * Comprueba si el usuario y contraseña son correctos, y en ese caso inicia una sesión nueva
//   */
//  def login(email: String, password: String) = {
//    repo.login(email, password)
//  }
//  
//  def isValid(email: String, password: String) = {
////    repo.isValid(email, password)
//  }
//}