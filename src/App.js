
import Auth from './Auth';
import Login from './Components/Login/Login';
import Signup from './Components/SignUp/SignUp';
import Navbar from "./Components/Nav/Nav";
import Cart from './Components/Cart/Cart';
import Order from './Components/Order/Order';
// import { db } from "./firebaseInit";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './Components/Home/Home';
import {UserContextProvider} from "./userContext";


function App() {

  const router = createBrowserRouter([
    {path : '/', element : (
      <UserContextProvider>
       <Navbar />
       </UserContextProvider>
    ),
      children : [
        {index: true, element : (
          <UserContextProvider>
            <Home />
            </UserContextProvider>
  )},
        {path : "login", element :  
        (
          <UserContextProvider>
        <Login />
        </UserContextProvider>
  )},
        {path : "signup", element : 
        (
          <UserContextProvider>
        <Signup />
        </UserContextProvider>
        )
      },
      {
        path : "cart", element : 
        (
          <UserContextProvider>
            <Cart />
          </UserContextProvider>
        )
      },
      {
        path : "orders", element : (
          <UserContextProvider>
            <Order />
          </UserContextProvider>
        )
      }
      ]
    }
  ])

  return (
    
    <RouterProvider router={router} />
    
  );
}

export default App;
