import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Beers from './pages/Beers';
import Home from './pages/Home';
import UserPage from './pages/UserPage';
import Customize from './pages/Customize';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }, {
    path: "/beers",
    element: <Beers />,
  }, {
    path: "/user",
    element: <UserPage />,
  }, {
    path: "/customize",
    element: <Customize />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
