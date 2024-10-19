import Home from "../pages/Home";
import LayoutUser from "../components/Layout/LayoutUser";

export const routes = [
  //Public
  {
    path: "/",
    element: <LayoutUser/>,
    children : [
      {
        index: true,
        element: <Home/>
      }
    ]
  }
]