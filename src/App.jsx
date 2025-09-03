import Home from "./Components/Home"
import Add from "./Components/Add"
import Login from "./Components/Login"
import Register from "./Components/Register"
import { createBrowserRouter,RouterProvider} from "react-router-dom"
function App() {
  const router = createBrowserRouter([
    
    {
      path:"/home",
      element:<Home/>
    },
    {
      path:"/add",
      element:<Add/>
    },
    {
      path:"/",
      element:<Login/>
    },
    {
      path:"/register",
      element:<Register/>
    }
  ])
  return (
      <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
