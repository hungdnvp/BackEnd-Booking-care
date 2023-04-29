import db from '../models/index';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);


let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassFromBcrypt = await hashPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPassFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            })
            resolve('Created a new user')
        } catch (e) {
            reject(e);
        }
    })

}

let hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPass = await bcrypt.hashSync(password, salt);
            resolve(hashPass);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = db.User.findOne(
                {
                    where: { id: userId },
                    raw: true,
                }
            )
            if (user) {
                resolve(user)
            } else {
                resolve({})
            }
        } catch (e) {
            reject(e)
        }
    })
}

let updateUser = (data)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let user = await db.User.findOne({
                where: {id : data.id}
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                
                await user.save();
                resolve(true);
            }else{
                resolve(false);
            }
        }catch(e){
            reject(e)
        }
    })
}

let deleteUserById = (userId)=>{
    return new Promise(async (resolve,reject) =>{
        try{
            let user = await db.User.findOne({
                where: {id : userId}
            })
            if(user){
                user.destroy();
                resolve(true);
            }else{
                resolve(false);
            }
        }catch(e){
            reject(e);
        }
    })
}


module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserById: getUserById,
    updateUser: updateUser,
    deleteUserById: deleteUserById,
}