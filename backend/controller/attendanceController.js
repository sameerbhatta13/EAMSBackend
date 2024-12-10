const { default: mongoose } = require('mongoose');
const Attendance = require('../model/attendanceModel');
const Employee = require('../model/employeeModel');


// Mark attendance
exports.markAttendance = async (req, res) => {
    try {
        const { employeeId, status, checkInTime, checkOutTime } = req.body;

       const employeeObjectId = new mongoose.Types.ObjectId(employeeId)
        // Check if employee exists
        const employee = await Employee.findOne({_id:employeeObjectId});
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Check if the attendance already exists for the day
        const existingAttendance = await Attendance.findOne({
            employeeId:employeeObjectId,
            date: new Date().toISOString().split('T')[0], // today's date without time
        });

        if (existingAttendance) {
            return res.status(400).json({ error: 'Attendance already marked for today' });
        }
        if (!checkInTime || new Date(checkInTime) > new Date()) {
            return res.status(400).json({ error: "Check-in time cannot be in the future" });
          }

        // Calculate if the employee is late
        const scheduledCheckInTime = new Date(checkInTime).setHours(9, 0, 0); // Example scheduled check-in time is 9:00 AM
        const isLate = new Date(checkInTime) > scheduledCheckInTime;

        // Create new attendance record
        let attendance = new Attendance({
            employeeId:employeeObjectId,
            date: new Date(), // today's date
            status,
            checkInTime,
            checkOutTime,
            isLate,
            isEarlyCheckout: checkOutTime ? new Date(checkOutTime).getHours() < 17 : false, // Example: 5:00 PM is scheduled checkout time
        });

        await attendance.save();
        res.status(201).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        console.error("Backend error:", error);
        res.status(500).json({ error: 'Server error',details:error.message });
    }
}

// Update attendance
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, checkInTime, checkOutTime } = req.body;

        const attendance = await Attendance.findById(id);
        if (!attendance) {
            return res.status(404).json({ error: 'Attendance record not found' });
        }

        // Update fields
        if (status) attendance.status = status;
        if (checkInTime) {
            attendance.checkInTime = checkInTime;
            const scheduledCheckInTime = new Date(checkInTime).setHours(9, 0, 0); // Example scheduled check-in time
            attendance.isLate = new Date(checkInTime) > scheduledCheckInTime;
        }
        if (checkOutTime) {
            attendance.checkOutTime = checkOutTime;
            attendance.isEarlyCheckout = new Date(checkOutTime).getHours() < 17 // Example: 5:00 PM scheduled checkout time
        }

        await attendance.save();
        res.status(200).json({ message: 'Attendance updated successfully', attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get attendance by employee and date
exports.getAttendanceByDate = async (req, res) => {
    try {
        const { employeeId, date } = req.params;

        const attendance = await Attendance.findOne({
            employeeId,
            date: new Date(date).toISOString().split('T')[0], // Remove time component
        });

        if (!attendance) {
            return res.status(404).json({ error: 'Attendance not found for the specified date' });
        }

        res.status(200).json({ attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all attendance records
exports.getAllAttendance = async (req, res) => {
    try {
        const employeeId=req.params.employeeId
        const attendance= await Attendance.find({employeeId})
        res.status(200).json(attendance)
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' })
    }
}
