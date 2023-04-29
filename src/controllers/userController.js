import userService from '../services/userService'


let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            errMessage: 'Missing inputs parameter !',
            user: {}
        })
    }
    let Data = await userService.handleLogin(email, password);
    return res.status(200).json({
        errCode: Data.errCode,
        errMessage: Data.errMessage,
        user: Data.user
    })
}

let handleGetUser = async (req,res) =>{
    let id = req.query.id;
    if(!id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            users: []
        })
    }

    let users = await userService.getUser(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateUser = async (req,res) => {
    let message = await userService.createUser(req.body);
    return res.status(200).json(message);
}
let handleEditUser = async (req,res) => {
    let data = req.body;
    let message = await userService.editUser(data);
    return res.status(200).json(message);
}
let handleDeleteUser = async (req,res)=>{
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}
let getAllcode = async (req,res) =>{
    try{
        setTimeout(async ()=>{
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        },2000)
    }catch(e){
        console.log('Get all code error: ',e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetUser: handleGetUser,
    handleCreateUser: handleCreateUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllcode: getAllcode,
}