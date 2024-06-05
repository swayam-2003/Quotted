import React, { useContext, useState } from 'react';
import myContext from '../../../context/data/myContext';
import { toast } from 'react-toastify';

function AddCoupon() {
    const context = useContext(myContext);
    const { addCoupon } = context;

    const [couponCode, setCouponCode] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');

    const handleAddCoupon = () => {
        if (!couponCode || !discountPercentage) {
            toast.error('Please fill all fields');
            return;
        }
        const coupon = {
            code: couponCode,
            discountPercentage: parseInt(discountPercentage),
        };
        addCoupon(coupon);
        setCouponCode('');
        setDiscountPercentage('');
    };

    return (
        <div>
            <div className="flex justify-center items-center min-h-screen py-10">
                <div className="bg-gray-800 px-10 py-10 rounded-xl ">
                    <div className="">
                        <h1 className="text-center text-white text-xl mb-4 font-bold">
                            Add Coupon
                        </h1>
                    </div>
                    <div>
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            name="couponCode"
                            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                            placeholder="Coupon Code"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                            name="discountPercentage"
                            className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                            placeholder="Discount Percentage"
                        />
                    </div>
                    <div className=" flex justify-center mb-3">
                        <button
                            onClick={handleAddCoupon}
                            className="bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg"
                        >
                            Add Coupon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddCoupon;
