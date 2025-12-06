import category from "../models/category.js";

export const all_categories = async() => {
    return await category.find();
}