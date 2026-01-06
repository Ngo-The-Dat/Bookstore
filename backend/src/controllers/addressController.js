import address from "../models/address.js";
import user from "../models/user.js"

export const get_all_address = async (req, res) => {
    try {
        const records = await address.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "USER",
                    foreignField: "_id",
                    as: "user_info"
                }
            },
            {
                $unwind: "$user_info"
            },
            {
                $project: {
                    // _id: 0,
                    name: "$user_info.FULL_NAME",
                    ADDRESS_LINE: 1,
                    IS_DEFAULT: 1,
                }
            }
        ])
        res.status(201).json(records)
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_all_address", error: error.message });
    }
}

export const update_address = async (req, res) => {
    try {
        const record = req.body;
        const id = req.params.id
        if (record.IS_DEFAULT === true) {
            await address.updateMany({ "IS_DEFAULT": true }, { $set: { "IS_DEFAULT": false } })
        }
        const result = await address.findByIdAndUpdate(id, { $set: { "IS_DEFAULT": true } }, { new: true })
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở update_address", error: error.message });
    }
}