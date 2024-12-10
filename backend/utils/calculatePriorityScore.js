const calculatePriority = (employee, leaveRequest) => {
    let score = 0;

    // 1. Seniority Level
    score += (4 - employee.seniorityLevel) * 50 // Senior employees get more points

    // 2. Leave Balance
    score += employee.leaveBalance <= 2 ? 30 : 0 // Employees with fewer leave balances get priority

    // 3. Leave Duration
    const leaveDuration = (new Date(leaveRequest.endDate) - new Date(leaveRequest.startDate)) / (1000 * 60 * 60 * 24)
    score += leaveDuration <= 3 ? 20 : leaveDuration <= 7 ? 10 : 0

    // 4. Date of Request
    const requestAge = (new Date() - new Date(leaveRequest.createdAt)) / (1000 * 60 * 60 * 24) // Days since request
    score += requestAge >= 7 ? 20 : requestAge >= 3 ? 10 : 0

    return score;
};

module.exports = calculatePriority;
