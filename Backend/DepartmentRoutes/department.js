const express = require('express');
const router = express.Router();
const Department = require('./modeldep.js');

//Different department name, model and route aliases
const departments = [
  { name: 'Anesthesiologist', model: Department.AnaesthesiaModel, routeAliases: ['anesthesiologist', 'anaesthesia'] },
  { name: 'Cardiologist', model: Department.CardiologyModel, routeAliases: ['cardiologist', 'cardiology'] },
  { name: 'Dentist', model: Department.DentalModel, routeAliases: ['dentist', 'dental'] },
  { name: 'Dermatologist', model: Department.DermatologyModel, routeAliases: ['dermatologist', 'dermatology'] },
  { name: 'ENT Specialist', model: Department.ENTModel, routeAliases: ['ent-specialist', 'ent'] },
  { name: 'Gastroenterologist', model: Department.GastroenterologyModel, routeAliases: ['gastroenterologist', 'gastroenterology'] },
  { name: 'Gynecologist', model: Department.GynecologistModel, routeAliases: ['gynecologist'] },
  { name: 'Nephrologist', model: Department.NephrologyModel, routeAliases: ['nephrologist', 'nephrology'] },
  { name: 'Neurologist', model: Department.NeurologyModel, routeAliases: ['neurologist', 'neurology'] },
  { name: 'Ophthalmologist', model: Department.OphthalmologyModel, routeAliases: ['ophthalmologist', 'ophthalmology'] },
  { name: 'Oncologist', model: Department.OncologyModel, routeAliases: ['oncologist', 'oncology'] },
  { name: 'Orthopedic Surgeon', model: Department.OrthopedicModel, routeAliases: ['orthopedic-surgeon', 'orthopedic'] },
  { name: 'Pediatrician', model: Department.PediatricsModel, routeAliases: ['pediatrician', 'pediatrics'] },
  { name: 'Pulmonologist', model: Department.PulmonologyModel, routeAliases: ['pulmonologist', 'pulmonology'] },
  { name: 'Radiologist', model: Department.RadiologyModel, routeAliases: ['radiologist', 'radiology'] },
  { name: 'Urologist', model: Department.UrologyModel, routeAliases: ['urologist', 'urology'] }
];


departments.forEach(department => {
  const defaultSlug = department.name.toLowerCase().replace(/\s+/g, '-');
  const routeAliases = [...new Set([...(department.routeAliases || []), defaultSlug])];

  // GET Endpoints (supports aliases for backward compatibility)
  routeAliases.forEach((slug) => {
    router.get(`/${slug}`, async (req, res) => {
      try {
        const departments = await department.model.find();
        res.json(departments);
      } catch (err) {
        res.status(500).json({ Message: err.message });
      }
    });
  });

  //Post Endpoint
  router.post(`/${department.name.toLowerCase()}`, async (req, res) => {
    try {
      const newDepartments = Array.isArray(req.body) ? req.body : [req.body];
      const savedDepartments = await department.model.insertMany(newDepartments);
      res.status(201).json(savedDepartments);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  //PutEndpoint
  router.put(`/${department.name.toLowerCase()}/:id`, async (req, res) => {
    try {
      const updatedDepartment = await department.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true,  runValidators: true }  
      );
      if (!updatedDepartment) {
        return res.status(404).json({ message: 'Department not found' });
      }
      res.json(updatedDepartment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

});

module.exports = router;
