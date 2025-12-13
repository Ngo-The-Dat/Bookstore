import { connectDB, closeDBConnection } from "../config/db.js";
import User from '../models/user.js';
import UserAuth from '../models/user_authentication.js';

const manageAccountUser = async () => {
    try {
        await connectDB();

        const result = await User.aggregate([
        {
            $lookup: {
                from: 'user_authentications',
                localField: '_id',
                foreignField: 'USER',
                as: 'auths'
            }
        },
        {
            $project: {
                _id: 1,
                HOTEN: 1,
                EMAIL: 1,
                ROLE: 1,
                IS_ACTIVE: 1,

                authCount: { $size: '$auths' },

                providers: {
                    $map: {
                        input: '$auths',
                        as: 'a',
                        in: '$$a.PROVIDER_NAME'
                    }
                }
            }
        }
        ]);

        console.table(result);

    } catch (error) {
        console.error('Error managing account users:', error);
    } finally {
        await closeDBConnection();
    }   
};

manageAccountUser();