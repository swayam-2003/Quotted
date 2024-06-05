import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import myContext from '../../context/data/myContext';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/cartSlice';
import { fireDB } from '../../firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};


function ProductInfo() {
    const context = useContext(myContext);
    const { loading, setLoading, products, selectedSize, setSelectedSize, selectedColor, setSelectedColor, customText, setCustomText, setProducts, selectedSlogan, setSelectedSlogan, slogans } = context;
    const params = useParams();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    console.log(slogans);

    const addCart = () => {
        const selectedProduct = { ...products, selectedSize, selectedColor, customText, selectedSlogan, selectedCategory };
        dispatch(addToCart(selectedProduct));
        toast.success('Added to Cart');
    };



    useEffect(() => {
        async function getProductData() {
            setLoading(true);
            try {
                const productTemp = await getDoc(doc(fireDB, "products", params.id));
                setProducts(productTemp.data());
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        getProductData();
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredSlogans, setFilteredSlogans] = useState([]);

    // Filter slogans based on selected category
    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        const filtered = slogans.filter(slogan => slogan.category === category);
        setFilteredSlogans(filtered);
    };

    // Update selected slogan
    const handleSloganChange = (e) => {
        setSelectedSlogan(e.target.value);
    };


    return (
        <Layout>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-10 mx-auto">
                    {products &&
                        <div className="lg:w-2/3 md:w-3/4 sm:w-full mx-auto flex">
                            <div className="lg:w-2/4 md:w-1/4 sm:w-full mx-auto" >
                                <Carousel
                                    swipeable={true}
                                    draggable={true}
                                    showDots={false}
                                    responsive={responsive}
                                    ssr={true}
                                    infinite={true}
                                    autoPlay={true}
                                    autoPlaySpeed={3000}
                                    keyBoardControl={true}
                                    customTransition="transform 500ms ease-in-out"
                                    transitionDuration={500}
                                    containerClass="carousel-container"
                                    itemClass="carousel-item"
                                >
                                    <img src={products.imageUrl1} alt="Product Image 1" className="carousel-image" />
                                    <img src={products.imageUrl2} alt="Product Image 2" className="carousel-image" />
                                    <img src={products.imageUrl3} alt="Product Image 3" className="carousel-image" />
                                </Carousel></div>

                            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                                    Quotted
                                </h2>
                                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                                    {products.title}
                                </h1>
                                <div className="flex mb-4">
                                    <div className="w-full mr-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Select Category:</label>
                                        <select value={selectedCategory} onChange={handleCategoryChange} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                            <option value="">Select Category</option>
                                            <option value="Spiritual">Spiritual</option>
                                            <option value="Bollywood">Bollywood</option>
                                            <option value="Motivational">Motivational</option>
                                        </select>
                                    </div>


                                    {filteredSlogans.length > 0 && (
                                        <div className="flex mb-4">
                                            <div className="w-full mr-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">Slogans for {selectedCategory}:</label>
                                                <select value={selectedSlogan} onChange={handleSloganChange} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                                    <option value="">Select Slogan</option>
                                                    {filteredSlogans.map((slogan, index) => (
                                                        <option key={index} value={slogan.text}>{slogan.text}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                    )}
                                </div>
                                <div className="flex mb-4">
                                    {/* Size dropdown */}
                                    <div className="w-full mr-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Size</label>
                                        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                            <option value="">Select Size</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                        </select>
                                    </div>
                                    {/* Color dropdown */}
                                    <div className="w-full">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Color</label>
                                        <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                            <option value="">Select Color</option>
                                            <option value="Red">Red</option>
                                            <option value="Blue">Blue</option>
                                            <option value="Green">Green</option>
                                            <option value="Yellow">Yellow</option>
                                        </select>
                                    </div>
                                </div>
                                {/* Custom text area */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Custom Text</label>
                                    <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} className="block w-full px-4 py-2 border border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline resize-none" placeholder="Custom Text"></textarea>
                                </div>
                                <p className="leading-relaxed border-b-2 mb-5 pb-5">
                                    {products.description}
                                </p>
                                <div className="flex items-center">
                                    <span className="title-font font-medium text-2xl text-gray-900">
                                        ₹{products.price}
                                    </span>
                                    <button onClick={addCart} className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                                        Add To Cart
                                    </button>
                                    <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                                        <svg
                                            fill="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>}
                </div>
            </section>
        </Layout >
    );
}

export default ProductInfo;
