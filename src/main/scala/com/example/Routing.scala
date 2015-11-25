package com.example

import akka.actor.Actor
import spray.routing._
import spray.http._

class RoutingActor extends Actor with StaticRoute {
  def actorRefFactory = context
  def receive = runRoute(staticRoute)
}

trait StaticRoute extends HttpService {
  val staticRoute = {
    path("visible") {
      getFromResource("client/normal.html")
    } ~ {
      getFromResourceDirectory("client")
    }
  }
}