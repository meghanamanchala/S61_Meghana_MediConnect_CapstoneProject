const express = require('express');
const PatientDetails = require('./patientdetails.js');
const mongoose = require('mongoose');
const DepartmentModels = require('../DepartmentRoutes/modeldep.js');

const router = express.Router();

const departmentModelEntries = Object.entries(DepartmentModels);

const findDoctorByIdAcrossDepartments = async (doctorId) => {
  if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
    return null;
  }

  for (const [departmentKey, model] of departmentModelEntries) {
    const doctor = await model.findById(doctorId).select('name').lean();
    if (doctor) {
      return {
        doctorName: doctor.name,
        doctorDepartment: departmentKey,
      };
    }
  }

  return null;
};

router.post('/', async (req, res) => {
    try {
      const payload = { ...req.body };

      if (!payload.doctorName && payload.doctor) {
        const resolvedDoctor = await findDoctorByIdAcrossDepartments(payload.doctor);
        if (resolvedDoctor) {
          payload.doctorName = resolvedDoctor.doctorName;
          payload.doctorDepartment = payload.doctorDepartment || resolvedDoctor.doctorDepartment;
        }
      }

      const patientDetails = new PatientDetails(payload);
      await patientDetails.save();
      res.status(201).json(patientDetails);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  router.get('/', async (req, res) => {
    try {
      const patients = await PatientDetails.find().populate('doctor').lean();

      const enrichedPatients = await Promise.all(
        patients.map(async (patient) => {
          if (patient.doctorName) {
            return patient;
          }

          if (patient.doctor && typeof patient.doctor === 'object' && patient.doctor.name) {
            return { ...patient, doctorName: patient.doctor.name };
          }

          const doctorId =
            typeof patient.doctor === 'string'
              ? patient.doctor
              : patient.doctor?._id;

          if (!doctorId) {
            return patient;
          }

          const resolvedDoctor = await findDoctorByIdAcrossDepartments(doctorId);

          if (!resolvedDoctor) {
            return patient;
          }

          return {
            ...patient,
            doctorName: resolvedDoctor.doctorName,
            doctorDepartment: patient.doctorDepartment || resolvedDoctor.doctorDepartment,
          };
        })
      );

      res.json(enrichedPatients);
    } catch (err) {
      console.error('Error fetching patient details:', err);
      res.status(500).json({ message: err.message });
    }
  });

  // PUT endpoint to update a patient record by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const updatedPatient = await PatientDetails.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedPatient) {
          return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(200).json(updatedPatient);
  } catch (err) {
      console.error('Error updating patient:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE endpoint to delete a patient record by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deletedPatient = await PatientDetails.findByIdAndDelete(id);
      if (!deletedPatient) {
          return res.status(404).json({ message: 'Patient not found' });
      }
      res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
      console.error('Error deleting patient:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
;
