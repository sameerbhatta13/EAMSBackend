const Employee = require('../model/employeeModel')
exports.postEmp = async (req, res) => {
  try {

    // Check if employee already exists based on email
    const existingEmployee = await Employee.findOne({ email: req.body.email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists with this email,please mark attendance' })
    }
    const profilePicturePath = req.file ? req.file.path : null

    let employee = new Employee({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
      },
      position: req.body.position,
      department: req.body.department,
      salary: req.body.salary,
      profilePicture: profilePicturePath,
     
    })

    employee = await employee.save()
    //    res.send(employee)
    res.json({ _id: employee._id, message: 'employee registered successfully' })
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering employee' });
  }
}


// exports.getRegisteredEmployees = async (req, res) => {
//   const userId = req.user._id; // Logged-in user's ID

//   try {
//       const employees = await Employee.find({ createdBy: userId });
//       res.status(200).json({ employees });
//   } catch (error) {
//       res.status(500).json({ msg: 'Error fetching employees', error });
//   }
// }


exports.getEmployeeId = async (req, res) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });  // Assuming userId is available in `req.user`
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ employeeId: employee.employeeId });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee data' });
  }
}

//for upload the profile of the employee 
exports.getEmployeeProfile = async (req, res) => {
  try {
    const { userId } = req.user; // Assuming `userId` is set in the request (from middleware like JWT authentication)

    const employee = await Employee.findOne({ userId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const profilePicturePath = `http://localhost:8000/${employee.profilePicture.replace(/\\/g, '/')}`

    res.json({
      employeeId: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      position: employee.position,
      department: employee.department,
      salary: employee.salary,
      profilePicture: profilePicturePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employee data' });
  }
}

//get all employee for admin

exports.getAllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find()
    res.json(employees)

  } catch (error) {
    res.status(500).josn({ error: 'failed to fetching employees' })
  }
}

//update employee records

exports.updateEmployee = async (req, res) => {
  try {
    const updateEmployeeData = await Employee.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: {
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
      },
      position: req.body.position,
      department: req.body.department,
      salary: req.body.salary,
      profilePicture: req.body.profilePicture
    },
      { new: true } //return the updated document
    )
    if (!updateEmployeeData) {
      return res.status(404).json({ message: 'emploeyee not found ' })
    }
    res.json(updateEmployeeData)
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: 'server error' })

  }
}

//delete employee

exports.deleteEmployee = async (req, res) => {
  try {
    const deleteEmployeeData = await Employee.findById(req.params.id)
    if (!deleteEmployeeData) {
      return res.status(404).json({ error: 'employee not found' })
    }
    res.json({ message: 'employee deleted successfully' })

  } catch (error) {
    res.status(500).json({ error: 'failed to delete employee' })

  }
}

exports.employeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId)
    if (!employee) {
      return res.status(400).json({ msg: 'employee not found' })
    }
    res.json(employee)

  } catch (error) {
    res.status(500).json({ msg: 'server error' })
  }
}