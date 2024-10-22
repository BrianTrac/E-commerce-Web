import Home from "../pages/Home";
import LayoutUser from "../components/Layout/LayoutUser";
import Search from "../pages/Search";

export const routes = [
  //Public
  {
    path: "/",
    element: <LayoutUser/>,
    children : [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "search/:keyword",
        element: <Search/>
      }
    ]
  }
]