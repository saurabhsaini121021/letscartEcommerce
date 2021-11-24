const app = require('./app');
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database');

//handling uncaught exception
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

//config
if (process.env.NODE_ENV !== 'PRODUCTION') {

    require('dotenv').config({ path: 'backend/config/config.env' });
}

//connect to database 
connectDatabase();

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});



//handle unhandled promise rejections - to prevent the server from crashing
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(` shutting down the server due to Unhandled Rejection`);
    //close server and exit process
    server.close(() => {
        process.exit(1);
    });
});