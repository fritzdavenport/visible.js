package com.example

import akka.actor.{ActorSystem, Props}
import akka.io.IO
import spray.can.Http
import akka.pattern.ask
import akka.util.Timeout
import scala.concurrent.duration._

object Boot extends App {
  implicit val system = ActorSystem("visiblejs")
  val service = system.actorOf(Props[RoutingActor], "visiblejs")
  
  implicit val timeout = Timeout(5.seconds)
  IO(Http) ? Http.Bind(service, interface = "localhost", port = 80)
}
