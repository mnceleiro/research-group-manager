package services

import scala.concurrent.Future

import models.entities.User
import models.entities.Users

object UserService {
  def add(user: User): Future[String] = {
    Users.add(user)
  }

  def delete(id: Long): Future[Int] = {
    Users.delete(id)
  }

  def get(id: Long): Future[Option[User]] = {
    Users.get(id)
  }

  def listAll: Future[Seq[User]] = {
    Users.listAll
  }
}