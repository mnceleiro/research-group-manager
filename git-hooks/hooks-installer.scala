object Main extends App {
  def getCurrentDirectory = new java.io.File(".").getCanonicalPath
  
  new java.io.FileOutputStream(getCurrentDirectory + "/../.git/hooks/pre-push") 
    getChannel() 
    transferFrom(
        new java.io.FileInputStream(getCurrentDirectory + "/pre-push") 
        getChannel, 
        0, 
        Long.MaxValue 
    )
    
    println("Hook creado con éxito!")
}
