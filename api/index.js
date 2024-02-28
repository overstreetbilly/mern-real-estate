import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';

dotenv.config();

const app = express();

app.use(express.json());

//Cookie parser
app.use(cookieParser());


mongoose.connect(process.env.MONGO_URL).then( ()=> {
    console.log('Connected to DB ok');
}).catch((err)=>{
    console.log(err);
});
app.listen(3000, ()=>{
    console.log('Nodemon Server is running on port 3000, nodemon is removed in production')
} );

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message =err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});