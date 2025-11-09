
import mongoose from "mongoose"
import { user, address, product, category, coupon, order, cart, review } from "../import.js"

export const get_all_documents = async (req, res) => {
    try {
        const { collection_name } = req.params
        const data = await mongoose.model(collection_name).find()
        res.json(data)
    } catch (error) {
        console.log(`Không có collection nào tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở get_all_documents" })
    }
}

export const add_document = async (req, res) => {
    try {
        const { collection_name } = req.params
        const Model = mongoose.model(collection_name)
        const record = new Model(req.body)
        const new_doc = await record.save()

        res.status(201).json(new_doc)
    } catch (error) {
        console.log(`Không có collection tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở add_document" })
    }
}

export const update_a_document = async (req, res) => {
    try {
        const { collection_name, id } = req.params
        const Model = mongoose.model(collection_name)
        const updated_document = await Model.findByIdAndUpdate(id, req.body, { new: true })
        if (!update_a_document) {
            res.status(404).json({ message: `Không tồn tại id ${id} để update` })
        }
        res.status(201).json(updated_document)
    } catch (error) {
        console.log(`Không có collection tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở update_a_document" })
    }

}

export const delete_document = async (req, res) => {
    try {
        const { collection_name, id } = req.params;
        const Model = mongoose.model(collection_name)

        const deleted_document = await Model.findByIdAndDelete(id)
        if (!deleted_document) {
            return res.status(404).json({ message: "Id không tồn tại để xóa" })
        }
        res.status(200).json(deleted_document)
    } catch (error) {
        console.log(`Không có collection nào tên ${collection_name}`)
        res.status(500).json({ message: "Lỗi ở delete_document" })
    }
}


export const get_bestsellers = async (req, res) => {
    try {

    } catch (error) {

    }
}