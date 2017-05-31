import javax.inject._
import play.api._
import play.api.http.HttpFilters
import play.api.mvc._

// Esta clase es cargada por play y se le pueden pasar una serie de filtros como parámetros (logear peticiones, añadir cabeceras, etc)
@Singleton
class Filters @Inject() (
  env: Environment,
  loggingFilter: LoggingFilter
) extends HttpFilters {

  override val filters = {
    if (env.mode == Mode.Dev) Seq(loggingFilter) else Seq.empty
  }

}
