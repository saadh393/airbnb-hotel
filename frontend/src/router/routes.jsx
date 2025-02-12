import CreateSpotForm from "../components/CreateSpot/CreateSpotForm";
import LandingPageSpots from "../components/Landingpage/Landingpage";
import SpotDetails from "../components/Spotdetailspage/Spotdetails";
import PrivateRoute from "../components/Utils/PrivateRoute";
import EditForm from "../components/ManageSpot/Edit/EditForm";
import Layout from "../layout";
import { createBrowserRouter } from "react-router-dom";
import ManageSpots from "../components/ManageSpot/ManageSport";
import ManageReview from "../components/Review/ManageReview";

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
        element: (
          <PrivateRoute>
            <EditForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetails />,
      },
      {
        path: "/spots/new",
        element: (
          <PrivateRoute>
            <CreateSpotForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/manageSpots",
        element: (
          <PrivateRoute>
            <ManageSpots />
          </PrivateRoute>
        ),
      },
      {
        path: "/manageReviews",
        element: (
          <PrivateRoute>
            <ManageReview />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
