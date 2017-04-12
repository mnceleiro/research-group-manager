package services

import scala.concurrent.Future

import models.entities.Researcher
import models.repositories.ResearcherRepository
import models.repositories.ResearcherRepository
import com.google.inject.Inject
import models.repositories.ResearcherRepository

class ResearcherService @Inject()(repo: ResearcherRepository) {
  def save(researcher: Researcher): Future[Researcher] = {
    repo.save(researcher)
  }

  def delete(id: Long): Future[Int] = {
    repo.delete(id)
  }

  def get(id: Long): Future[Option[Researcher]] = {
    repo.get(id)
  }
  
  def getByEmail(email: String): Future[Option[Researcher]] = {
    repo.getByEmail(email)
  }
  
  def update(researcher: Researcher): Future[Researcher] = {
    repo.update(researcher)
  }

  def listAll: Future[Seq[Researcher]] = {
    repo.listAll
  }
}