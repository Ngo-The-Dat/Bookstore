//import all models and library
import mongoose from 'mongoose';
import dotenv from "dotenv";
import express from "express";
import user from "./models/user.js";
import address from "./models/address.js"
import product from './models/product.js';
import category from './models/category.js';
import coupon from './models/coupon.js';
import order from './models/order.js';
import cart from './models/cart.js';
import review from './models/review.js';

export {
    mongoose,
    dotenv,
    express,
    user,
    address,
    product,
    category,
    coupon, order,
    cart,
    review
}