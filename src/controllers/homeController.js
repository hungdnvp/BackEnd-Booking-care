import db from '../models/index';
import CRUDService from '../services/CRUDService';
import bcrypt from 'bcryptjs';

let getHomePage = async (req,res)=>{
    return res.render('homepage.ejs');
}

let getCRUD = (req,res)=>{
    return res.render('crud.ejs');
}

let postCRUD = async (req,res) =>{
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.redirect('/displayUser');

}

let displayUser = async (req,res)=>{
    let data =  await CRUDService.getAllUser();
    return res.render('displayUser.ejs',{
        dataTable: data
    });
}

let getEditCRUD = async (req,res)=>{
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDService.getUserById(userId);
        //check user data not found

        return res.render('editUser.ejs',{
            userData: userData
        });
    }else{
        return res.send("User not found");
    }
}

let putCRUD = async (req,res)=>{
    let data = req.body;
    let result = await CRUDService.updateUser(data);
    if(result){
        return res.redirect('/displayUser');
    }else{
        return res.send('update error');
    }
}

let deleteCRUD = async (req,res)=>{
    let id = req.query.id;
    if(id){
        let result = await CRUDService.deleteUserById(id);
        if(result){
            res.send('deleted user ')
        }else{
            return res.send('delete error');
        }
    }else{
        return res.send("User not found");
    }
}
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayUser: displayUser,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}