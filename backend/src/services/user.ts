import Argon2Utils from '@utils/argon2';
import Errors from '@utils/errorClasses';
import UserModel from '@models/user';

class UserService {

    static async createUser(name: string, email: string, password: string){

        const passwordHash = await Argon2Utils.hashPassword(password);

        if(!passwordHash) throw new Errors.ValidationError('Erro ao criptografar senha.');

        await UserModel.create(name, email, passwordHash);
        
    }

}

export default UserService;