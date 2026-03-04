const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Doctor = require('../DoctorSchema/DoctorSchema')
const patientDetailsSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  date: Date,
  amount: Number,
  reason: String,
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  doctorName: String,
  doctorDepartment: String
});

const PatientDetails = mongoose.model('PatientDetails', patientDetailsSchema);
module.exports = PatientDetails;
