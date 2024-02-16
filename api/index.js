import express from 'express';
const app = express();

app.listen(3000, () => {
    console.log('Server is Running on port 3000 using nodemon. Nodemon is removed in production');
})