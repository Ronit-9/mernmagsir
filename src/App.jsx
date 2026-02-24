
import { RouterProvider } from "react-router-dom"
import { createBrowserRouter } from "react-router-dom"
import Home from "./pages/home/Home"
import RootLayout from "./RootLayout"
import NotFound from "./pages/not-found/NotFound"
import ListItem from "./pages/meal/ListItem"
import Meal from "./pages/meal/Meal"
import Search from "./pages/meal/Search"



export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout/>,
      children: [
        {
          index: true,
          element: <Home/>
        },
        {
             path: 'item-list/:label',
             element: <ListItem/>
        },
        { 
          path: 'meal/:id',
          element: <Meal/>

        },
        {
           path: 'search',
           element: <Search/>
        },
      
        {
          path: "*",
          element: <NotFound/>
        }
        
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>

  )
}
