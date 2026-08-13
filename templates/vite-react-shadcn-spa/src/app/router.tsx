import { createBrowserRouter, type RouteObject } from "react-router"

import { AppLayout } from "@/app/layout"
import { ErrorPage } from "@/routes/error/page"
import { Home } from "@/routes/home/page"
import { NotFound } from "@/routes/not-found/page"

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: AppLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: Home },
      { path: "*", Component: NotFound },
    ],
  },
]

export const router = createBrowserRouter(routes)
