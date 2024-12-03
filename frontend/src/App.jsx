// frontend/src/App.jsx

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"

import Navigation from "./components/Navigation/Navigation.jsx"
import * as sessionActions from "./store/session"
import LandingPageSpots from "./components/Landingpage/Landingpage"

function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPageSpots />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
