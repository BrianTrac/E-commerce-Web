import Home from "../pages/Home";
import LayoutUser from "../components/Layout/LayoutUser";
import Search from "../pages/Search";
import Category from "../pages/Category";

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
      },
      {
        path: ":category",
        element: <Category />
      }
    ]
  }
]