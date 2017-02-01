package services

import scala.concurrent.Future

import models.entities.User
import models.repositories.UserRepository

object UserService {
  def add(user: User): Future[String] = {
    UserRepository.add(user)
  }

  def delete(id: Long): Future[Int] = {
    UserRepository.delete(id)
  }

  def get(id: Long): Future[Option[User]] = {
    UserRepository.get(id)
  }

  def listAll: Future[Seq[User]] = {
    UserRepository.listAll
  }
}