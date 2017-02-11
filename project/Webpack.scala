import play.sbt.PlayRunHook
import sbt._
import java.net.InetSocketAddress

object Webpack {
  
  import scala.language.postfixOps

  private def cmd(name: String, base: File): Command = {
    if (!base.exists()) {
      base.mkdirs()
    }
    Command.args(name, "<" + name + "-command>") {
      (state, args) =>
        if (System.getProperty("os.name").startsWith("Windows")) {
          Process("cmd" :: "/c" :: name :: args.toList, base) !<
        } else {
          Process(name :: args.toList, base) !<
        }
        state
    }
  }
  
  def apply(base: File): PlayRunHook = {
    
    object WebpackHook extends PlayRunHook {
      
      private def getCommand(comm: String) : String = {
        if (System.getProperty("os.name").startsWith("Windows")) {
          "cmd /c " + comm
        } else {
          comm
        }
      }
      
      override def beforeStarted(): Unit = {
//        Process("cmd /c npm install", base).run
        Process(getCommand("npm install"), base).!
      }

      var watchProcess: Option[Process] = None

      override def afterStarted(addr: InetSocketAddress): Unit = {
//        watchProcess = Some(Process("cmd /c webpack --watch", base).run)
        watchProcess = Some(Process(getCommand("npm run compile"), base).run)
      }

      override def afterStopped(): Unit = {
        watchProcess.map(p => p.destroy())
        watchProcess.map(p => p.destroy())
        watchProcess.map(p => p.destroy())
        watchProcess = None
      }
    }
    
    WebpackHook
  }
}