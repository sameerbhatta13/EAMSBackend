const Attendance=require('../model/attendanceModel') // Replace with your actual attendance model
const Leave = require('../model/leaveRequestModel');

exports.generateEmployeeReport = async (req, res) => {
  const { Id } = req.params;

  try {
    // Fetch attendance records
    const attendanceRecords = await Attendance.find({ Id }).sort({ date: -1 }); // Sorted by most recent

    // Fetch leave requests
    const leaveRequests = await Leave.find({ Id }).sort({ startDate: -1 }); // Sorted by most recent

    // Combine data into a structured report
    const report = {
      Id,
      attendance: attendanceRecords,
      leaveRequests: leaveRequests,
    };

    // Send the report
    return res.status(200).json({ msg: 'Employee report generated successfully', report });
  } catch (error) {
    return res.status(500).json({ msg: 'Error generating employee report', error });
  }
};
