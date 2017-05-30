import javax.inject.Inject
import akka.util.ByteString
import play.api.Logger
import play.api.libs.streams.Accumulator
import play.api.mvc._
import scala.concurrent.ExecutionContext
import play.api.libs.iteratee.Iteratee
import play.api.libs.iteratee.Enumeratee
import scala.concurrent.Future
import play.api.libs.json.Json

class LoggingFilter @Inject() (implicit ec: ExecutionContext) extends EssentialFilter {
  def apply(nextFilter: EssentialAction) = new EssentialAction {
    def apply(requestHeader: RequestHeader) = {

      val startTime = System.currentTimeMillis

      val accumulator: Accumulator[ByteString, Result] = nextFilter(requestHeader)

      accumulator.map { result =>

        val endTime = System.currentTimeMillis
        val requestTime = endTime - startTime
        
//        var msg = s"${requestHeader.method} ${requestHeader.uri} took ${requestTime}ms and returned ${result.header.status}"
//        if (requestHeader.method == "POST") {
//          val body = result.body.asInstanceOf[AnyContentAsJson].json.toString()
//          msg += " with body " + body
//        }
        
        Logger.info(s"${requestHeader.method} ${requestHeader.uri} took ${requestTime}ms and returned ${result.header.status}")
        
        result.withHeaders("Request-Time" -> requestTime.toString)
      }
    }
  }
}
