import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from '../controllers/doctorController';
let router = express.Router();

let initWebRoutes = (app) =>{
    router.get('/',homeController.getHomePage);
    router.get('/crud',homeController.getCRUD);
    router.post('/post-crud',homeController.postCRUD);
    router.get('/displayUser',homeController.displayUser);
    router.get('/edit-crud',homeController.getEditCRUD);
    router.post('/put-crud',homeController.putCRUD);
    router.get('/delete-crud',homeController.deleteCRUD);

    // *********API********************//
    router.post('/api/login',userController.handleLogin);
    router.get('/api/get_user',userController.handleGetUser)
    router.post('/api/create_user',userController.handleCreateUser);
    router.put('/api/edit_user',userController.handleEditUser);
    router.delete('/api/delete_user',userController.handleDeleteUser);
    router.get('/api/allcode',userController.getAllcode);

    router.get('/api/get_top_doctor_home',doctorController.getTopDoctor);
    router.get('/api/get_all_doctor',doctorController.getAllDoctor);
    router.post('/api/save_infor_doctor',doctorController.postInforDoctor);
    router.get('/api/get_detail_doctor',doctorController.getDetailDoctor);





    return app.use("/",router);
}

module.exports =  initWebRoutes;