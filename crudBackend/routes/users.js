const express = require('express');
const router = express.Router();
const service = require('../Services/user.service');
const auth = require('../Middleware/auth');

// Mock routes
  router.get('/', auth, async (req, res)=> {
    const employees = await service.getAllEmployees()
    res.send(employees)
  });

  router.post('/', auth, async (req, res) => {
    await service.addOrEditEmployee(req.body)
    res.status(201).send('created successfully.')
  })

  router.put('/:id', auth, async (req, res) => {
    const affectedRows = await service.addOrEditEmployee(req.body, req.params.id)
    if (affectedRows == 0)
        res.status(404).json('no record with given id : ' + req.params.id)
    else
        res.send('updated successfully.')
  })

  router.delete('/:id', auth, async (req, res) => {
    const affectedRows = await service.deleteEmployee(req.params.id)
    if (affectedRows == 0)
        res.status(404).json('no record with given id : ' + req.params.id)
    else
        res.send('deleted successfully.')
  })

  module.exports = router;