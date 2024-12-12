// frontend/src/App.jsx

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Navigation from "./components/Navigation/Navigation.jsx";
import * as sessionActions from "./store/session";
import LandingPageSpots from "./components/Landingpage/Landingpage";
import SpotDetails from "./components/Spotdetailspage/Spotdetails.jsx";
import CreateSpotForm from "./components/CreateSpot/CreateSpotForm.jsx";
import ManageSpots from "./components/ManageSpot/ManageSport.jsx";
import EditForm from "./components/ManageSpot/Edit/EditForm.jsx";
import ManageReview from "./components/Review/ManageReview.jsx";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPageSpots />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <EditForm />,
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetails />,
      },
      {
        path: "/spots/new",
        element: <CreateSpotForm />,
      },
      {
        path: "/manageSpots",
        element: <ManageSpots />,
      },
      {
        path: "/manageReviews",
        element: <ManageReview />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
