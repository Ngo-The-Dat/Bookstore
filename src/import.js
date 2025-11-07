//import all model and library
import mongoose from 'mongoose';
import dotenv from "dotenv";
import express from "express";
import user from "./model/user.js";
import address from "./model/address.js"
import product from './model/product.js';
import category from './model/category.js';
import coupon from './model/coupon.js';
import order from './model/order.js';
import order_details from './model/order_details.js';
import cart from './model/cart.js';
import cart_details from './model/cart_details.js';
import review from './model/review.js';

export {
    mongoose,
    dotenv,
    express,
    user,
    address,
    product,
    category,
    coupon, order,
    order_details,
    cart,
    cart_details,
    review
}