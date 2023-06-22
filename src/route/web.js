import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
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

    //*****************DOCTOR********************* */
    router.get('/api/get_top_doctor_home',doctorController.getTopDoctor);
    router.get('/api/get_all_doctor',doctorController.getAllDoctor);
    router.post('/api/save_infor_doctor',doctorController.postInforDoctor);
    router.get('/api/get_detail_doctor',doctorController.getDetailDoctor);
    router.get('/api/get_detail_doctor_extra',doctorController.getDetailDoctorExtra);
    router.get('/api/get_profile_doctor',doctorController.getProfileDoctor);
    router.get('/api/get_list_patient',doctorController.getListPatient);
    router.post('/api/examine_success',doctorController.examineSuccess);



    //*****************SCHEDULE**************** */
    router.post('/api/bulk_create_schedule',doctorController.bulkCreateSchedule);
    router.get('/api/get_schedule_by_date',doctorController.getScheduleByDate);

    // PATIENT/////////////////////////
    router.post('/api/patient_book_appointment',patientController.postBookAppointment);
    router.get('/api/verify_booking',patientController.getVerifyBooking);
    // SPECIALTY ////////////////////
    router.post('/api/create_specialty',specialtyController.createSpecialty);
    router.get('/api/get_all_specialty',specialtyController.getAllSpecialty);
    router.get('/api/get_detail_specialty',specialtyController.getDetailSpecialty);

    // CLINIC ////////////////////
    router.post('/api/create_clinic',clinicController.createClinic);
    router.get('/api/get_all_clinic',clinicController.getAllClinic);
    router.get('/api/get_detail_clinic',clinicController.getDetailClinic);







    return app.use("/",router);
}

module.exports =  initWebRoutes;