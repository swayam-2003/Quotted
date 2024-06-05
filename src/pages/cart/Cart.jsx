import React, { useContext, useEffect, useState } from 'react'
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFromCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';

function Cart() {
  const context = useContext(myContext)
  const { mode, coupons } = context;

  const dispatch = useDispatch();

  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Removed from Cart");
  }

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  });

  const cartItems = useSelector((state) => state.cart);
  console.log(cartItems);

  const [totalAmount, setTotalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp = temp + parseInt(cartItem.price);
    });
    setTotalAmount(temp);
  }, [cartItems]);

  const shipping = 50;
  const grandTotal = shipping + totalAmount;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");


  const buyNow = async () => {
    // Validation 
    if (name === "" || address === "" || pincode === "" || phoneNumber === "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    };

    var options = {
      key: "rzp_test_5fOLmEu5LpLyYI",
      key_secret: "savlBBPgIwtkIYzujCXsYssw",
      amount: grandTotal * 100,
      currency: "INR",
      order_receipt: 'order_rcptid_' + name,
      name: "Quotted",
      description: "Quotted description",
      handler: async function (response) {
        console.log(response);
        toast.success('Payment Successful');

        const paymentId = response.razorpay_payment_id;

        // Store in Firebase
        const orderInfo = {
          cartItems,
          addressInfo,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          email: JSON.parse(localStorage.getItem("user")).user.email,
          userid: JSON.parse(localStorage.getItem("user")).user.uid,
          paymentId
        };

        try {
          await addDoc(collection(fireDB, "orders"), orderInfo);
          console.log("Order successfully stored in Firestore:", orderInfo);
        } catch (error) {
          console.error("Error storing order in Firestore:", error);
          toast.error("Failed to store order in Firestore");
        }
      },
      theme: {
        color: "#3399cc"
      }
    };

    var pay = new window.Razorpay(options);
    pay.open();
  }
  const isCouponUsed = (couponCode) => {
    const usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || [];
    return usedCoupons.includes(couponCode);
  };

  const applyCoupon = () => {
    if (!couponCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (isCouponUsed(couponCode)) {
      setCouponError('Coupon has already been used.');
      return;
    }

    const coupon = coupons.find((c) => c.code === couponCode);
    if (!coupon) {
      setCouponError('Invalid coupon code.');
      return;
    }

    // Calculate discount and update total amount
    const discountAmount = (totalAmount * coupon.discountPercentage) / 100;
    setTotalAmount(totalAmount - discountAmount);

    // Mark coupon as used and store in localStorage
    const usedCoupons = [...(JSON.parse(localStorage.getItem('usedCoupons')) || []), couponCode];
    localStorage.setItem('usedCoupons', JSON.stringify(usedCoupons));

    setCouponCode('');
    setCouponError('');
  };

  const clearUsedCoupons = () => {
    localStorage.removeItem('usedCoupons');
  };

  return (
    <Layout>
      <div className="h-screen bg-gray-100 pt-5" style={{ backgroundColor: mode === 'dark' ? '#282c34' : '', color: mode === 'dark' ? 'white' : '' }}>
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {cartItems.map((item, index) => (
              <div key={index} className="justify-between mb-6 rounded-lg border drop-shadow-xl bg-white p-6 sm:flex sm:justify-start" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '' }}>
                <img src={item.imageUrl1} alt="product-image" className="w-full rounded-lg sm:w-40" />
                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2 className="text-lg font-bold text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.title}</h2>
                    <h2 className="text-sm text-gray-900" style={{ color: mode === 'dark' ? 'white' : '' }}>{item.description}</h2>
                    <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{item.price}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Size: {item.selectedSize}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Color: {item.selectedColor}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Custom Text: {item.customText}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Slogan: {item.selectedSlogan}</p>
                  </div>
                  <div onClick={() => deleteCart(item)} className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3" style={{ backgroundColor: mode === 'dark' ? 'rgb(32 33 34)' : '', color: mode === 'dark' ? 'white' : '' }}>
            {/* Coupon code input field */}
            <div className="flex justify-between mb-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
              />
              <button
                onClick={applyCoupon}
                className="focus:outline-none w-1/4 text-white bg-violet-600 hover:bg-violet-800 outline-0 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Apply Coupon
              </button>
            </div>
            {/* Display error message if coupon code is invalid */}
            {couponError && (
              <p className="text-red-500 text-sm mb-2">{couponError}</p>
            )}
            <div className="mb-2 flex justify-between">
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Subtotal</p>
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>Shipping</p>
              <p className="text-gray-700" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{shipping}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p className="text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>Total</p>
              <div>
                <p className="mb-1 text-lg font-bold" style={{ color: mode === 'dark' ? 'white' : '' }}>₹{grandTotal}</p>
              </div>
            </div>
            <Modal name={name} address={address} pincode={pincode} phoneNumber={phoneNumber} setName={setName} setAddress={setAddress} setPincode={setPincode} setPhoneNumber={setPhoneNumber} buyNow={buyNow} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Cart;
