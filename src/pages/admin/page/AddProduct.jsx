import React, { useContext } from 'react';
import myContext from '../../../context/data/myContext';

function AddProduct() {
    const context = useContext(myContext);
    const { products, setProducts, addProduct } = context;
    return (
        <div>
            <div className='flex justify-center items-center min-h-screen py-10'>
                <div className='bg-gray-800 px-10 py-10 rounded-xl '>
                    <div className="">
                        <h1 className='text-center text-white text-xl mb-4 font-bold'>Add Product</h1>
                    </div>
                    <div>
                        <input
                            type="text"
                            onChange={(e) => setProducts({ ...products, title: e.target.value })}
                            value={products.title}
                            name='title'
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product title'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='price'
                            onChange={(e) => setProducts({ ...products, price: e.target.value })}
                            value={products.price}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product price'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='imageurl1'
                            onChange={(e) => setProducts({ ...products, imageUrl1: e.target.value })}
                            value={products.imageUrl1}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product Image Url 1'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='imageurl2'
                            onChange={(e) => setProducts({ ...products, imageUrl2: e.target.value })}
                            value={products.imageUrl2}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product Image Url 2'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='imageurl3'
                            onChange={(e) => setProducts({ ...products, imageUrl3: e.target.value })}
                            value={products.imageUrl3}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product Image Url 3'
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name='category'
                            onChange={(e) => setProducts({ ...products, category: e.target.value })}
                            value={products.category}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product category'
                        />
                    </div>
                    <div>
                        <textarea
                            cols="30" rows="10"
                            name='description'
                            onChange={(e) => setProducts({ ...products, description: e.target.value })}
                            className='bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none'
                            placeholder='Product description'
                        ></textarea>
                    </div>
                    <div className=' flex justify-center mb-3'>
                        <button
                            onClick={addProduct}
                            className='bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg'>
                            Add Product
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddProduct;
