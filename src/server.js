import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/connectDB";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import cors from 'cors';
require('dotenv').config();

let app = express();
//config app
app.use(cors({origin: true}))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit:'10mb'}));

viewEngine(app);
initWebRoutes(app);
connectDB();
let port = process.env.PORT || 8000;
app.listen(port,()=>{
    //callback
    console.log('backend is running on the port: ' + port);
});