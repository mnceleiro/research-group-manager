package services

import scala.concurrent.Future

import models.entities.Researcher
import models.repositories.ResearcherRepository

object ResearcherService {
  def add(researcher: Researcher): Future[String] = {
    ResearcherRepository.add(researcher)
  }

  def delete(id: Long): Future[Int] = {
    ResearcherRepository.delete(id)
  }

  def get(id: Long): Future[Option[Researcher]] = {
    ResearcherRepository.get(id)
  }

  def listAll: Future[Seq[Researcher]] = {
    ResearcherRepository.listAll
  }
}