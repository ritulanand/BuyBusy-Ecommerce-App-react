
import Auth from './Auth';
import Login from './Components/Login/Login';
import Signup from './Components/SignUp/SignUp';
import Navbar from "./Components/Nav/Nav";
import Cart from './Components/Cart/Cart';
import Order from './Components/Order/Order';
// import { db } from "./firebaseInit";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from './Components/Home/Home';



function App() {

  const router = createBrowserRouter([
    {path : '/', element : (
      
       <Navbar />
      
    ),
      children : [
        {index: true, element : (
         
            <Home />
           
  )},
        {path : "login", element :  
        (
          
        <Login />
        
  )},
        {path : "signup", element : 
        (
          
        <Signup />
        
        )
      },
      {
        path : "cart", element : 
        (
          
            <Cart />
          
        )
      },
      {
        path : "orders", element : (
          
            <Order />
          
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
