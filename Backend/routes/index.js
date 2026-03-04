const express = require('express');

const departmentRoutes = require('../DepartmentRoutes/department.js');
const userRoutes = require('../AuthenticationRoutes/userRoutes.js');
const postRoutes = require('../PostQueryRoutes/postRoutes.js');
const patientRoutes = require('../PatientDetails/patientdetailsroutes.js');
const paymentRoutes = require('../Payment/paymentGateway.js');
const authRoutes = require('../GoogleAuth/Authentication.js');
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();

router.use('/departments', departmentRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/patients', patientRoutes);
router.use('/payments', paymentRoutes);
router.use(authRoutes);

router.use('/protected-route', verifyToken);
router.get('/protected-route', (req, res) => {
  res.send('This is a protected route');
});

module.exports = router;
