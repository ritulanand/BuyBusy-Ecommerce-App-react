//IMPORT HOOK AND CONTEXT
import {
    useState,
    useContext,
    createContext,
    useReducer,
    useEffect
} from 'react';


//IMPORT DATABASE
import { db , auth} from "./firebaseInit"

//IMPORT FIREBASE KEYWORDS
import {
    setDoc,
    addDoc,
    collection,
    getDocs,
    updateDoc,
    doc
} from 'firebase/firestore';

//GETTING TOAST
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import {useNavigate} from "react-router-dom";

//CREATE CONTEXT
const userContext = createContext();



//USE CUSTOM HOOK
export const useUserContext = () => {
    const value = useContext(userContext);
    return value;
}

const reducer = (state, action) => {

    switch (action.type) {
        case "SET_USER":
            
            return {
                ...state,
                user : action.payload
            };

        case "SET_CART":
            return {
                ...state,
                userCart: action.payload
            };

        case "CHECKOUT":
            return {
                ...state,
                userOrder: [...state.userOrder, action.payload],
                userCart: []
            };
        case "REMOVE_FROM_CART":
            return {
                ...state,
                userCart: state.userCart.filter(product => product.id !== action.payload)
            };

        
        default:
            return state;
    }
}

const initialState = {
    user : null,
    userCart : [],
    userOrder : [],
    loading : false,
    error : null
}




//USE CUSTOM CONTEXT
export const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();


    const [state, dispatch] = useReducer(reducer, initialState );
    console.log("state", state);



    //get date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    //check authentication
    const authenticateUser = async (email, password) => {
        console.log("email passwo", email, password);
        try{
       const userCredential = await signInWithEmailAndPassword(auth, email,password);
    
       console.log("userred", userCredential);
       
       dispatch({type: "SET_USER", payload : userCredential.user});
       
       return userCredential;
        }
        catch(error){
            // alert("please enter correct details");
            console.log("eror", error);
            return error;
        }
     
    }

    //add new user
    const newUser =  async (name, email, password) => {
        try{
        const userCredential =  await createUserWithEmailAndPassword(auth, email, password);
        console.log("userred sugn up", userCredential);
        if(userCredential){
            await updateProfile(auth.currentUser, {displayName : name});

            dispatch({type: "SET_USER", payload : { ...userCredential.user, displayName : name}});
    
            await setDoc(doc(db , "users", userCredential.user.uid), {name, email} );
            // await setDoc(doc(db , "users", user.uid, "cart", ), {name, email} );
        }
       
        return userCredential;
        }catch(error){
            console.log("error signup", error);
            // alert("please enter correct details")
            return error;
            
        }
       
        
    }

    //logout user
    const logout = async () => {
        await signOut(auth);

    }

    //set use cart
    const setCartUser = (cart) => {
        dispatch({ type: "SET_CART", payload: cart });
    }

    // checkout
    const checkOut = () => {
        let orderDate = date.toString() + '-' + month.toString() + '-' + year.toString();
        let newOrder = { date: orderDate, order: state.userCart };

        if (state.userCart.length === 0) {
            toast.error("Please add items to cart to purchase");
            return;
        }
        dispatch({ type: "CHECKOUT", payload: newOrder });
        toast.success("Items Purchased Successfully");
    
    };

    //remove from cart
    const removeFromCart = (id) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: id });
        toast.error("Item deleted Successfully");
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                dispatch({type: "SET_USER", payload : currentUser});
            } else {
                dispatch({type: "SET_USER", payload : null});
            }
          });
          return () => {
            unsubscribe();
          }
    }, [])

    return (
        <userContext.Provider value={{
            authenticateUser,
            newUser,
            logout,
            setCartUser,
            removeFromCart,
            checkOut,
            ...state,
         
        }}>
            {children}
        </userContext.Provider>
    )
}