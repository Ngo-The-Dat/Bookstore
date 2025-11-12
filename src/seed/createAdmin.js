import { mongoose, dotenv } from '../import.js';
import { connectDB, closeDBConnection } from "../config/db.js";
import User from '../model/user.js';
import UserAuth from '../model/user_authentication.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'nguyentin@admin.com';// <---- Chỉnh sửa email ở đây
        // 1. Kiểm tra xem admin đã tồn tại chưa
        const adminUser = await User.findOne({ EMAIL: adminEmail });
        if (adminUser) {
            console.log('Tài khoản admin đã tồn tại.');
            closeDBConnection();
            return;
        }

        // 2. Tạo user
        const newUser = await User.create({// <---- Chỉnh sửa thông tin ở đây
            HOTEN: 'Admin',
            PHAI: 'Nam',
            EMAIL: adminEmail,
            SDT: '0000000001',
            NGAYSN: new Date(),
            ROLE: 'admin'
        });

        await UserAuth.create({
            USER: newUser._id,
            PROVIDER_NAME: 'LOCAL',
            CREDENTIAL: '0sY78Q$jNti3fQ4P'// <---- Chỉnh sửa mật khẩu ở đây
        });

        console.log('Tạo tài khoản admin thành công!');
        closeDBConnection();

    } catch (error) {
        console.error('Lỗi khi tạo admin:', error.message);
        closeDBConnection();
    }
};

// Chạy hàm
createAdmin();