import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/Home';
import Beers from './pages/Beers';
import UserPage from './pages/UserPage';

const props = {
  SERVER_PATH: 'https://thegrill.gargant.dev'
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  }, {
    path: "/beers",
    element: <Beers {...props} />,
  }, {
    path: "/user",
    element: <UserPage {...props} />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
