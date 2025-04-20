import { useState, useContext, createContext, useReducer, useEffect } from 'react';
import products from "./products.json"; 

// IMPORT DATABASE
import { db, auth } from "./firebaseInit";

// IMPORT FIREBASE KEYWORDS
import { setDoc, addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

// CREATE CONTEXT
const userContext = createContext();

// USE CUSTOM HOOK
export const useUserContext = () => {
    return useContext(userContext);
};

// REDUCER FUNCTION
const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload };
        case "SET_CART":
            return { ...state, userCart: action.payload };
        case "CHECKOUT":
            return { ...state, userOrder: [...state.userOrder, action.payload], userCart: [] };
        case "REMOVE_FROM_CART":
            return { ...state, userCart: state.userCart.filter(product => product.id !== action.payload) };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    userCart: [],
    userOrder: [],
    loading: false,
    error: null
};

// USER CONTEXT PROVIDER
export const UserContextProvider = ({ children }) => {
    // const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);

    // GET CURRENT DATE
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const date = currentDate.getDate();

    // AUTHENTICATION FUNCTIONS
    const authenticateUser = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            dispatch({ type: "SET_USER", payload: userCredential.user });
            return userCredential;
        } catch (error) {
            console.log("error", error);
            return error;
        }
    };

    const newUser = async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, { displayName: name });
            dispatch({ type: "SET_USER", payload: { ...userCredential.user, displayName: name } });
            await setDoc(doc(db, "users", userCredential.user), { name, email });
            return userCredential;
        } catch (error) {
            console.log("error signup", error);
            return error;
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    // SET CART
    const setCartUser = (cart) => {
        dispatch({ type: "SET_CART", payload: cart });
    };

    // CHECKOUT
    const checkOut = () => {
        let orderDate = `${date}-${month}-${year}`;
        let newOrder = { date: orderDate, order: state.userCart };

        if (state.userCart.length === 0) {
            toast.error("Please add items to cart to purchase");
            return;
        }
        dispatch({ type: "CHECKOUT", payload: newOrder });
        toast.success("Items Purchased Successfully");
    };

    // REMOVE ITEM FROM CART
    const removeFromCart = async (id) => {
        await deleteDoc(doc(db, "users", state.user.uid, "carts", id));
        console.log("delete", await deleteDoc(doc(db, "users", state.user.uid, "carts", id)))
        dispatch({ type: "REMOVE_FROM_CART", payload: id });
        toast.error("Item deleted Successfully");
    };


      
    // AUTH STATE CHANGE
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                dispatch({ type: "SET_USER", payload: currentUser });
            } else {
                dispatch({ type: "SET_USER", payload: null });
            }
        });
        return () => unsubscribe();
    }, []);

    // GET USER CART DATA
    useEffect(() => {
        const getUserCart = async () => {
            if (state.user) {
                console.log("user", state.user.uid);
                const cartsData = await getDocs(collection(db, "users", state.user.uid, "carts"));
                const userCartData = cartsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            console.log("userCartData", userCartData);
                dispatch({ type: "SET_CART", payload: userCartData });
            }
        };
        if (state.user) {
            getUserCart();
        }
    }, [state.user]); // Re-run only when user is updated

 

const addProductsToFirestore = async (products) => {
    try {
        const productsCollectionRef = collection(db, "products");
        console.log("productsCollectionRef", productsCollectionRef);

        for (const product of products.slice(0, 20)) {
            console.log("product", product.id);
            const productRef = doc(productsCollectionRef, product.id.toString());
            await setDoc(productRef, product); // Overwrites if exists
        }

        console.log("Products added/updated successfully.");
    } catch (error) {
        console.error("Error adding products to Firestore:", error);
    }
};



   
    useEffect(() => {
        const checkAndAdd = async () => {
            const snapshot = await getDocs(collection(db, "products"));
            if (snapshot.empty) {
                console.log("item addded");
                addProductsToFirestore(products);
            } else {
                console.log("Products already exist in Firestore, skipping add.");
            }
        };
        checkAndAdd();
    }, []);
    
    
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
    );
};
