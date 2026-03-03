import { createBrowserRouter } from "react-router-dom"
import { RouterProvider } from "react-router-dom"
import RootLayout from "@/RootLayout"
import Home from "./pages/home/Home"
import NotFound from "./pages/notfound/NotFound"
import SearchCocktail from "./pages/cocktail/SearchCocktail"
import Ingredient from "./pages/cocktail/Ingredient"



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
              path:"search",
              element: <SearchCocktail/>
            },
            {
              path:"item/:id",
              element:<Ingredient/>
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
