//GETTING STYLE
import styles from "../Styles/Home.module.css";


//GETTING USER CONTEXT TO USE
import { useUserContext } from "../../userContext"

//GETTING HOOKS
import { useState, useEffect } from "react"

//GETTING NAVLINK TO ROUTE THE PAGES
import { NavLink } from "react-router-dom"

// GETTING TOAST
import { toast } from 'react-toastify';
import { db } from "../../firebaseInit";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";

const Home = () => {
    const { userCart, setCartUser, user } = useUserContext();
    // console.log("user home", user);

    //FILTER
    //filter search
    const [priceFilter, setPriceFilter] = useState(1000);
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);

    //price filter
    const handlePriceFilter = (e) => {
        setPriceFilter(Number(e.target.value));
    };

    //category filter
    const handleCategoryFilter = (e) => {
        const category = e.target.value;
        if (selectedCategories.includes(category)) {
            console.log("handle category", category, selectedCategories);
            // Deselect category if it's already selected
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
            // Select category if it's not already selected
            console.log("else handle category", category, selectedCategories);
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    //search query
    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value);
    };
    //using fakestore API to render fake items in page
    // useEffect(() => {
    //     fetch('https://fakestoreapi.com/products')
    //     .then(res =>  res.json()).then( data => {
    //         console.log("data", data);
    //         setProducts(data);
    //         setLoading(false);
    //     })
    //     .catch(err => {
    //         console.log("err", err);
    //         setLoading(false);
    //     })
    // }, []);
   

    //  Fetch products from Firestore
     useEffect(() => {
        const fetchProductsFromFirestore = async () => {
            try {
                const productsCollectionRef = collection(db, "products");
                const productsSnapshot = await getDocs(productsCollectionRef);
                console.log("productsSnapshot", productsSnapshot.docs);
                const productsData = productsSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id, // Use Firestore document ID
                }));
                console.log("productsData", productsData);
                setProducts(productsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products from Firestore:", error);
                setLoading(false);
            }
        };

        fetchProductsFromFirestore();
    }, []);


  
    if (loading) {
        return (
            <h1>Loading...</h1>
        )
    }
    //filtered products
    const filteredProducts = products.filter((product) => {
        const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchPrice = product.price <= priceFilter;

        const matchCategory = selectedCategories.length === 0 || selectedCategories.some((category) => product.category.toLowerCase() === category.toLowerCase());
        // console.log("matchsearch", matchSearch);
        // console.log("matchPrice", matchPrice);
        // console.log("matchCategory", matchCategory);

        return matchCategory && matchSearch && matchPrice;
    })

     //add to cart
     const addToCart = async (id) => {
        console.log("id", id)
        if (!userCart || !products) {
            console.error("userCart or products is undefined");
            return;
        }

        console.log("userCart__  ",userCart);

        let alreadyInCart = userCart.find((product) => product.product_id == id);//TODO "YgB3uBFNnjTjRlsI4DL5"  == "1"
        let newCartProduct = products.find((product) => product.product_id == id); //REmove 
        console.log("usercart", userCart);
        console.log("alreadt", alreadyInCart);
        console.log("newcartproduct", products);
        console.log("newcartproduct>>", newCartProduct);
        

        if (alreadyInCart) {
            console.log("cart alredy");

              // Update the existing product in the cart
            const cartItemRef = doc(db, "users", user.uid, "carts", alreadyInCart.id);
            console.log("cartItemRef", cartItemRef);
            await updateDoc(cartItemRef, {
                count: alreadyInCart.count + 1, // Increment the count
            });
            

            
            setCartUser(
                userCart.map((item) =>
                    item.id === alreadyInCart.id ? { ...item, count: item.count + 1 } : item
                )
            )
           
            toast.success("Item count increased Added to Cart");
        }
        else {
            console.log("else added");
            newCartProduct.count = 1;
            
           // Reference to the user's carts collection
           const cartsCollectionRef = collection(db, "users", user.uid, "carts");

           // Add the new product to the carts collection
           const docRef = await addDoc(cartsCollectionRef, {
               ...newCartProduct,
           });

           console.log("docref", docRef);

           // Assign the generated document ID to the product
           newCartProduct.id = docRef.id;
           console.log("newcartproduct id", newCartProduct.id);
            setCartUser([...userCart, newCartProduct]);
            
            toast.success("Item Added to Cart");
        }
    }

   

    //set selected catagory
    const isCategorySelected = (category) => {
        // console.log("selectedcat", selectedCategories);
        return selectedCategories.includes(category);
      };
    return (
        <>
            <div className={styles.container}>
                <aside className={styles.filterContainer}>
                    <h2>Filter</h2>
                    <form>
                        <label htmlFor="price" className={styles.pricel}>Price: {priceFilter}</label>
                        <input type="range" name="price" min="1" max="1000" step="20" value={priceFilter} className={styles.price} onChange={handlePriceFilter} />
                        <h2>Category</h2>
                        <div className={styles.catagoryContainer}>
                            <div className={styles.catagory}>
                                <input 
                                type="checkbox"
                                id="mensFashion"
                                value="Men's Clothing"
                                onChange={handleCategoryFilter}
                                checked={isCategorySelected("Men's Clothing")}
                                />
                                <label htmlFor="mensFashion">Men's Clothing</label>
                            </div>
                            <div className={styles.catagory}>
                                <input 
                                type="checkbox"
                                id="womensFashion"
                                value="Women's Clothing"
                                onChange={handleCategoryFilter}
                                checked={isCategorySelected("Women's Clothing")}
                                />
                                <label htmlFor="womensFashion">Women's Clothing</label>
                            </div>
                            <div className={styles.catagory}>
                                <input type="checkbox"
                                id="jewelery"
                                value="jewelery"
                                onChange={handleCategoryFilter}
                                checked={isCategorySelected("jewelery")}
                                />
                                <label htmlFor="jewelery">Jewelery</label>
                            </div>
                            <div className={styles.catagory}>
                                <input 
                                type="checkbox"
                                id="electronics"
                                value="Electronics"
                                onChange={handleCategoryFilter}
                                checked={isCategorySelected("Electronics")}
                                />
                                <label htmlFor="electronics">Electronics</label>
                            </div>
                        </div>
                    </form>
                </aside>
                <form className={styles.searchContainer}>
                    <input 
                    type="search"
                    placeholder="search your item here..." 
                    onChange={handleSearchQuery}
                    />
                </form>
                <div className={styles.productContainerGrid}>
                    {filteredProducts.map((item) => (
                        <div className={styles.productContainer} key={item.id}>
                            <div className={styles.productImageContainer}>
                                <img src={item.image} alt="bag" />
                            </div>
                            <div className={styles.productDetailContainer}>
                                <div className={styles.name}>
                                    <p>
                                        {item.title}
                                    </p>
                                </div>
                                <div className={styles.price}>
                                    <p>
                                        &#x20B9; {item.price}
                                    </p>
                                </div>
                                {user?
                                <button className={styles.btn} onClick={() => addToCart(item.product_id)}>Add to Cart</button>
                                :
                                <NavLink to='/login' className={styles.btn} >Add to Cart</NavLink>
                                }  
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default Home;