import { createBrowserRouter, type RouteObject } from "react-router"

import { AppLayout } from "@/app/layout"
import { Home } from "@/routes/home/page"

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: AppLayout,
    children: [{ index: true, Component: Home }],
  },
]

export const router = createBrowserRouter(routes)
