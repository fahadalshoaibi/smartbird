import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useCreateOrderMutation } from '../../redux/features/orders/orderAPI';

const Checkout = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const totalPrice = cartItems.reduce((acc, product) => acc + product.price, 0).toFixed(2);
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data) => {
        console.log('Form Data:', data);
        console.log('Current User:', currentUser);

        const newOrder = {
            name: data.name,
            email: currentUser?.email,
            address: {
                city: data.city,
                country: data.country,
                state: data.state,
                zipcode: data.zipcode,
            },
            phone: data.phone,
            productIds: cartItems.map(item => item?._id),
            totalPrice: totalPrice,
        };

        console.log('New Order:', newOrder);

        try {
            await createOrder(newOrder).unwrap();
            alert('Order Placed Successfully');
            navigate("/orders");
        } catch (error) {
            console.log('Error placing order:', error);
            setErrorMessage('Failed to place order. Please try again.');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <section>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <div>
                        <div>
                            <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Site</h2>
                            <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
                            <p className="text-gray-500 mb-6">Items: {cartItems.length > 0 ? cartItems.length : 0}</p>
                        </div>
                        <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                                <div className="text-gray-600">
                                    <p className="font-medium text-lg">Personal Details</p>
                                    <p>Please fill out all the fields.</p>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                        <div className="md:col-span-5">
                                            <label htmlFor="name">Full Name</label>
                                            <input
                                                {...register("name", { required: true })}
                                                type="text" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                            {errors.name && <span className="text-red-500">Full Name is required</span>}
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                {...register("email", { required: true })}
                                                type="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                            {errors.email && <span className="text-red-500">Email is required</span>}
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="city">City</label>
                                            <input
                                                {...register("city", { required: true })}
                                                type="text" id="city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                            {errors.city && <span className="text-red-500">City is required</span>}
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="country">Country</label>
                                            <input
                                                {...register("country", { required: true })}
                                                type="text" id="country" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                            {errors.country && <span className="text-red-500">Country is required</span>}
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="state">State</label>
                                            <input
                                                {...register("state", { required: true })}
                                                type="text" id="state" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                            {errors.state && <span className="text-red-500">State is required</span>}
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="zipcode">Zipcode</label>
                                            <input
                                                {...register("zipcode", { required: true })}
                                                type="text" id="zipcode" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                            {errors.zipcode && <span className="text-red-500">Zipcode is required</span>}
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="phone">Phone</label>
                                            <input
                                                {...register("phone", { required: true })}
                                                type="text" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                            {errors.phone && <span className="text-red-500">Phone is required</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-5">
                                    <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 mt-4">Checkout</button>
                                </div>
                            </form>
                            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;