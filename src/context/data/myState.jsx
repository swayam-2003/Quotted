import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { fireDB } from '../../firebase/FirebaseConfig';
import { Timestamp, addDoc, collection, onSnapshot, orderBy, query, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';


function MyState(props) {
    const [mode, setMode] = useState('light');
    const [loading, setLoading] = useState(false);

    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    }

    const [products, setProducts] = useState({
        title: "",
        price: "",
        imageUrl1: "",
        imageUrl2: "",
        imageUrl3: "",
        category: "",
        description: "",
        size: "", // Added size
        color: "", // Added color
        customText: "", // Added custom text
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )

    })

    // ********************** Add Product Section  **********************
    const addProduct = async () => {
        /* if (products.title == null || products.price == null || products.category == null || products.description == null) {
             return toast.error('Please fill all fields')
         } */
        const productRef = collection(fireDB, "products")
        setLoading(true)
        try {
            await addDoc(productRef, products)
            toast.success("Product Add successfully")
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);
            getProductData()
            closeModal()
            setLoading(false)
        } catch (error) {
            toast.error(error.message)
            console.log(error)
            setLoading(false)
        }
        setProducts("")
    }

    const [product, setProduct] = useState([]);

    // ********************** Get Product Section  **********************
    const getProductData = async () => {
        setLoading(true)
        try {
            const q = query(
                collection(fireDB, "products"),
                orderBy("time"),
                // limit(5)
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let productsArray = [];
                QuerySnapshot.forEach((doc) => {
                    productsArray.push({ ...doc.data(), id: doc.id });
                });
                setProduct(productsArray)
                setLoading(false);
            });
            return () => data;
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductData();
    }, []);


    // ********************** Update Product Section  **********************

    const edithandle = (item) => {
        setProducts(item);
    };

    const updateProduct = async (item) => {
        setLoading(true);
        try {
            await setDoc(doc(fireDB, "products", item.id), products);
            toast.success("Product Updated Successfully");
            getProductData();
            window.location.href = '/dashboard';

            setLoading(false);
        } catch (error) {
            toast.error("Couldn't Update the Product Deets")
            console.log(error);
            setLoading(false);
        }
    };


    const deleteProduct = async (item) => {
        setLoading(true);
        try {
            await deleteDoc(doc(fireDB, "products", item.id));
            toast.success("Product Deleted Successfully");
            getProductData();
            setLoading(false);

        } catch (error) {
            toast.error("Product could not be deleted")
            console.log(error);
            setLoading(false);
        }
    };

    const [order, setOrder] = useState([]);

    const getOrderData = async () => {
        setLoading(true)
        try {
            const result = await getDocs(collection(fireDB, "orders"))
            const ordersArray = [];
            result.forEach((doc) => {
                ordersArray.push(doc.data());
                setLoading(false)
            });
            setOrder(ordersArray);
            console.log(ordersArray)
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }


    useEffect(() => {
        getProductData();
        getOrderData()

    }, []);

    const [user, setUser] = useState([]);

    const getUserData = async () => {
        setLoading(true)
        try {
            const result = await getDocs(collection(fireDB, "users"))
            const usersArray = [];
            result.forEach((doc) => {
                usersArray.push(doc.data());
                setLoading(false)
            });
            setUser(usersArray);
            console.log(usersArray)
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getProductData();
        getOrderData();
        getUserData();
    }, []);

    const [searchkey, setSearchkey] = useState('')
    const [filterType, setFilterType] = useState('')
    const [filterPrice, setFilterPrice] = useState('')

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [customText, setCustomText] = useState('');

    const [slogan, setSlogan] = useState('');
    const [category, setCategory] = useState('');

    const handleAddSlogan = async () => {
        setLoading(true)
        if (!slogan || !category) {
            setLoading(false);
            return toast.error("Please fill all details");
        }
        try {
            setLoading(false)
            await addDoc(collection(fireDB, 'slogans'), {
                text: slogan,
                category: category,
                createdAt: new Date(),
            });
            // Clear input fields after adding slogan
            setSlogan('');
            setCategory('');
            toast.success('Slogan added successfully');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);
        } catch (error) {
            console.error('Error adding slogan:', error);
            setLoading(false)
            toast.error('Failed to add slogan');
        }
    };

    const [slogans, setSlogans] = useState([]);
    const [selectedSlogan, setSelectedSlogan] = useState('');

    const getSlogans = async () => {
        setLoading(true);
        try {
            const slogansRef = collection(fireDB, 'slogans');
            const unsubscribe = onSnapshot(slogansRef, (snapshot) => {
                const slogansArray = [];
                snapshot.forEach((doc) => {
                    slogansArray.push({ id: doc.id, ...doc.data() });
                });
                setSlogans(slogansArray);
                setLoading(false);
            });
            return unsubscribe;
        } catch (error) {
            console.error('Error fetching slogans:', error);
            setLoading(false);
            toast.error('Failed to fetch slogans');
        }
    };

    useEffect(() => {
        // Fetch slogans when component mounts
        getSlogans();
    }, []);

    const [coupons, setCoupons] = useState([]); // State to store coupons

    // Function to add a new coupon to the database
    const addCoupon = async (coupon) => {
        try {
            await addDoc(collection(fireDB, 'coupons'), coupon);
            toast.success('Coupon added successfully');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 500);
        } catch (error) {
            console.error('Error adding coupon:', error);
            toast.error('Failed to add coupon');
        }
    };

    // Function to retrieve coupons from the database
    const getCoupons = async () => {
        try {
            const querySnapshot = await getDocs(collection(fireDB, 'coupons'));
            const couponsData = [];
            querySnapshot.forEach((doc) => {
                couponsData.push({ id: doc.id, ...doc.data() });
            });
            setCoupons(couponsData);
        } catch (error) {
            console.error('Error getting coupons:', error);
        }
    };

    useEffect(() => {
        getCoupons();
    }, []);

    return (
        <MyContext.Provider value={{
            mode, toggleMode, loading, setLoading,
            products, setProducts, addProduct, product, setProduct, edithandle, updateProduct, deleteProduct, order, user,
            searchkey, setSearchkey, filterType, setFilterType, filterPrice, setFilterPrice, selectedSize,
            setSelectedSize, selectedColor, setSelectedColor, customText, setCustomText,
            slogan, setSlogan, selectedSlogan, setSelectedSlogan, category, setCategory, handleAddSlogan, slogans,
            coupons, addCoupon
        }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default MyState;
