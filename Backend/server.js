const express = require('express');
const connectDB = require('./config/db.js'); 
const cors = require('cors');
const departmentRoutes = require('./DepartmentRoutes/department.js'); 
const userRoutes = require('./AuthenticationRoutes/userRoutes.js');
const postRoutes = require('./PostQueryRoutes/postRoutes.js');
const patientRoutes = require('./PatientDetails/patientdetailsroutes.js')
// const DocAdminRoute = require('./DoctorLogin/DoctorRoutes.js');
const cookieParser = require('cookie-parser'); 
const jwt = require('jsonwebtoken');
const paymentRoutes = require('./Payment/paymentGateway.js');
const auth = require('./GoogleAuth/Authentication.js')
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser()); 

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("No token provided");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid token");
        }
        req.username = decoded.userId;
        next();
    });
};
// Apply middleware to protected routes

app.use("/protected-route", verifyToken);
// Example of using the middleware
app.get("/protected-route", (req, res) => {
    // Access req.username to get the username
    res.send("This is a protected route");
});
app.use('/departments', departmentRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/patients', patientRoutes);
// app.use('/docAdmin',DocAdminRoute);
app.use(auth)
app.use('/payments', paymentRoutes); 

app.get('/', (req, res) => {
    res.status(200).send("Connected to DB");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

connectDB().then(() => {
    console.log('Connected to MongoDB');
    
    app.listen(3000, () => {
        console.log('Server is listening on port 3000');
    });
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});