import db from '../models/index';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({      // check mail again
                    attributes: ['id','email','roleId','password','firstName','lastName'],
                    where: { email: email },
                    raw: true
                    })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password); // check pass
                    if (check) {
                        delete user.password;
                        resolve({
                            errCode:0,
                            errMessage: 'OK',
                            user: user
                        })
                    }else{
                        resolve({
                            errCode: 3,
                            errMessage: 'Password is incorrect',
                            user: {}
                        })
                    }
                } else {        // mail lose
                    resolve({
                        errCode: 2,
                        errMessage: `Your's Email isn't exist in system.`,
                        user: {}
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Your's Email isn't exist in system.`,
                    user: {}
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getUser = (userId)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let users =''
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes:{
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !=='ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }catch(e){
            reject(e)
        }
    })
}

let createUser = (data)=>{
    return new Promise( async(resolve,reject) =>{
        try{
            // check email
            let check = await checkUserEmail(data.email);
            if(check === true){
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used, Plz try another email'
                })
            }
            else{
                let hashPassFromBcrypt = await hashPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPassFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        }catch(e){
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

let deleteUser = (userId) => {
    return new Promise(async (resolve,reject)=>{
        try{

            let user = await db.User.findOne({
                where: {id: userId}
            })
            if(!user){
                resolve({
                    errCode:2,
                    errMessage: `the user isn't exist`
                })
            }
    
            await db.User.destroy({
                where:{id: userId}
            })
            resolve({
                errCode:0,
                errMessage: 'the user is deleted'
            })
        }catch(e){
            reject(e);
        }
    })
}

let editUser = (data) =>{
    return new Promise( async (resolve,reject) =>{
        try{
            if(!data.id || !data.roleId || !data.position || !data.gender){
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameter`
                })
            }
            let user = await db.User.findOne({
                where: {id : data.id},
                raw: false
            })
            if(user){
                user.email = data.email;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phoneNumber;
                user.gender = data.gender;
                user.positionId = data.position;
                user.roleId = data.roleId;
                if(data.avatar){
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update the user successful'
                });
            }else{
                resolve({
                    errCode: 1,
                    errMessage: `User's not found.`
                });
            }
        }catch(e){
            reject(e)
        }
    })
}
let getAllCodeService = (typeInput) =>{
    return new Promise(async (resolve,reject)=>{
        try{
            if(!typeInput){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }else{
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {type: typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);

            }
        }catch(e){
            reject(e)
        }
    })
}
module.exports = {
    handleLogin: handleLogin,
    getUser: getUser,
    createUser: createUser,
    deleteUser: deleteUser,
    editUser: editUser,
    getAllCodeService: getAllCodeService,
}