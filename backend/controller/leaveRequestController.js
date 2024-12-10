
const Leave=require('../model/leaveRequestModel')
const Employee = require('../model/employeeModel')
const calculatePriority = require('../utils/calculatePriorityScore')

exports.leaveController=async(req,res)=>{
    const {employeeId,startDate,endDate,reason}=req.body

    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Validate that endDate is greater than startDate
    if (end <= start) {
      return res.status(400).json({ msg: 'End date must be greater than start date' });
    }

    try{
        let leaveRequest=new Leave({
            employeeId,
            startDate:start,
            endDate:end,
            reason
        })
        await leaveRequest.save()
        res.status(201).json({msg:'leave request submitted successfully',leaveRequest})
    }
    catch(error){
        res.status(500).json({msg:'error create leave request'})

    }
}


// Leave controller
exports.updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;
  
    try {
      // Find leave request
      const leaveRequest = await Leave.findById(leaveId).populate('employeeId');
  
      if (!leaveRequest) {
        return res.status(404).json({ msg: 'Leave request not found' });
      }
  const employee=leaveRequest.employeeId

  const priority=calculatePriority(employee,leaveRequest)
//   leaveRequest.priority=priority;
//   const leaveDuration=(new Date(leaveRequest.endDate)- new Date(leaveRequest.startDate))/(1000*60*60*24)+1
      // Update status based on priority
      if (leaveRequest.priority <= 50) {
        leaveRequest.status = 'approved'// High-priority requests get approved
        // employee.leaveBalance -=leaveDuration
      } else {
        leaveRequest.status = 'rejected';  // Lower-priority requests get rejected
      }
  
      await leaveRequest.save();
  
      return res.status(200).json({ msg: 'Leave request status updated', leaveRequest });
    } catch (error) {
      return res.status(500).json({ msg: 'Error updating leave request', error });
    }
  };
  

exports.getEmployeeLeaves=async (req,res) => {
    const {employeeId}=req.params
    try{
        const leaveRequests=await Leave.find({employeeId})
        return res.status(200).json({leaveRequests})
    }catch(error){
        res.status(500).json({ message: "Error fetching leave requests", error });
    }
    
}

exports.getAllLeaves=async(req,res)=>{
    try{
        const leaveRequest=await Leave.find().populate('employeeId','firstName lastName')
        res.status(200).json(leaveRequest)
    }catch(error){
        console.log('error fetching the leave request',error)
        res.json({message:'server error'})

    }
}

//algorithm to process leave request 

exports.processLeaveRequest = async (req, res) => {
    const { leaveId } = req.params;

    try {
        // Find the leave request by ID
        const leaveRequest = await Leave.findById(leaveId).populate('employeeId'); // Populating employee data

        if (!leaveRequest) {
            return res.status(404).json({ msg: 'Leave request not found' });
        }

        // Get employee data
        const employee = leaveRequest.employeeId;

        // Calculate priority
        const priority = calculatePriority(employee, leaveRequest);
        leaveRequest.priority = priority;

        // Save updated priority to leave request
        await leaveRequest.save();

        // Return success message with updated leave request
        return res.status(200).json({ msg: 'Leave request processed successfully', leaveRequest });
    } catch (error) {
        return res.status(500).json({ msg: 'Error processing leave request', error });
    }
};


