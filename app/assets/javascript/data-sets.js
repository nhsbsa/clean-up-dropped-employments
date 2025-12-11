const shData = [
    { employmentId: 1, schemeCode: 2008, startDate: "01/04/2013", endDate: "31/03/2015", updated: "31/03/2015", status: "Active", endReasonCode: 15, group: 1 },
    { employmentId: 2, schemeCode: 2015, startDate: "01/04/2015", endDate: null, updated: "31/03/2025", status: "Active", endReasonCode: 5, group: 2 },
    { employmentId: 3, schemeCode: 2015, startDate: "01/04/2015", endDate: null, updated: "31/03/2023", status: "Active", endReasonCode: 5, group: 2, error: true  },
    { employmentId: 5, schemeCode: 2015, startDate: "01/04/2015", endDate: null, updated: "31/03/2023", status: "Active", endReasonCode: 5, group: 2, error: true  }
];


const sgData = [
    { groupId: 1, schemeCode: 2008, startDate: "01/04/2013", endDate: null, status: "Active", endReasonCode: 25 },
    { groupId: 2, schemeCode: 2015, startDate: "01/04/2015", endDate: null, status: "Active", endReasonCode: null }
];


const ehData = [
    { employmentId: 1, employerCode: 5266, startDate: "01/04/2013", endDate: "09/11/2014", wholeOrPartTime: "Whole time", capacityCode: 1, employmentType: 8, actualHours: null, standardHours: null },
    { employmentId: 1, employerCode: 5266, startDate: "10/11/2014", endDate: "31/03/2015", wholeOrPartTime: "Part time", capacityCode: 1, employmentType: 8, actualHours: 30, standardHours: 37.5 },
    { employmentId: 2, employerCode: 5266, startDate: "01/04/2015", endDate: null, wholeOrPartTime: "Part time", capacityCode: 1, employmentType: 8, actualHours: 30, standardHours: 37.5 },
    { employmentId: null, employerCode: null, startDate: null, endDate: null, wholeOrPartTime: null, capacityCode: null, employmentType: null, actualHours: null, standardHours: null, error: true  },
    { employmentId: null, employerCode: null, startDate: null, endDate: null, wholeOrPartTime: null, capacityCode: null, employmentType: null, actualHours: null, standardHours: null, error: true  }
];

const ctData = [
    { empId: 1, start: '01/04/2013', end: '31/03/2014', empConts: '£2758.45', tpp: '£30649.19', employerConts: '£4290.88', empPay: '£30649.19' },
    { empId: 1, start: '01/04/2014', end: '31/03/2015', empConts: '£2543.26', tpp: '£27346.81', employerConts: '£3828.55', empPay: '£27346.81' },

    { empId: 2, start: '01/04/2015', end: '31/03/2016', empConts: '£2561.40', tpp: '£27541.88', employerConts: '£3938.50', empPay: '£27541.88' },
    { empId: 2, start: '01/04/2016', end: '31/03/2017', empConts: '£2606.68', tpp: '£28028.77', employerConts: '£4008.11', empPay: '£28028.77' },
    { empId: 2, start: '01/04/2017', end: '31/03/2018', empConts: '£2676.32', tpp: '£28777.58', employerConts: '£4138.22', empPay: '£28777.58' },
    { empId: 2, start: '01/04/2018', end: '31/03/2019', empConts: '£2796.78', tpp: '£30072.69', employerConts: '£4324.45', empPay: '£30072.69' },
    { empId: 2, start: '01/04/2019', end: '31/03/2020', empConts: '£3013.71', tpp: '£32405.39', employerConts: '£4659.89', empPay: '£32405.39' },
    { empId: 2, start: '01/04/2020', end: '31/03/2021', empConts: '£2781.95', tpp: '£29913.84', employerConts: '£4301.60', empPay: '£29913.84' },
    { empId: 2, start: '01/04/2021', end: '31/03/2022', empConts: '£3067.51', tpp: '£32984.12', employerConts: '£4743.11', empPay: '£32984.12' },
    { empId: 2, start: '01/04/2022', end: '31/03/2023', empConts: '£3661.75', tpp: '£38306.89', employerConts: '£5508.53', empPay: '£38306.89' },
    { empId: 2, start: '01/04/2023', end: '31/03/2024', empConts: '£4037.04', tpp: '£41845.03', employerConts: '£5918.68', empPay: '£41845.03' },
    { empId: 2, start: '01/04/2024', end: '31/03/2025', empConts: '£4365.41', tpp: '£44544.90', employerConts: '£6405.55', empPay: '£44544.90' },

    { empId: 3, start: '01/04/2015', end: '31/03/2016', empConts: '£154.96', tpp: '£1666.20', employerConts: '£238.27', empPay: '£1666.20' },
    { empId: 3, start: '01/04/2016', end: '31/03/2017', empConts: '£209.97', tpp: '£2257.74', employerConts: '£322.86', empPay: '£2257.74' },
    { empId: 3, start: '01/04/2017', end: '31/03/2018', empConts: '£76.76', tpp: '£825.31', employerConts: '£118.68', empPay: '£825.31' },
    { empId: 3, start: '01/04/2018', end: '31/03/2019', empConts: '£844.37', tpp: '£9079.24', employerConts: '£1305.60', empPay: '£9079.24' },
    { empId: 3, start: '01/04/2019', end: '31/03/2020', empConts: '£1247.04', tpp: '£13409.03', employerConts: '£1928.21', empPay: '£13409.03' },
    { empId: 3, start: '01/04/2020', end: '31/03/2021', empConts: '£147.17', tpp: '£1582.42', employerConts: '£227.55', empPay: '£1582.42' },
    { empId: 3, start: '01/04/2021', end: '31/03/2022', empConts: '£755.70', tpp: '£8125.74', employerConts: '£1168.47', empPay: '£8125.74' },

    // Error row
    { empId: 3, start: '01/04/2022', end: '31/03/2023', empConts: '£496.26', tpp: '£5063.88', employerConts: '£730.11', empPay: '£5063.88', error: true }
];

const hhData = [
    { empId: 1, start: '10/11/2014', end: '31/03/2015', partTimeHours: 613 },

    { empId: 2, start: '01/04/2015', end: '31/03/2016', partTimeHours: 1574 },
    { empId: 2, start: '01/04/2016', end: '31/03/2017', partTimeHours: 1596 },
    { empId: 2, start: '01/04/2017', end: '31/03/2018', partTimeHours: 1574 },
    { empId: 2, start: '01/04/2018', end: '31/03/2019', partTimeHours: 1564 },
    { empId: 2, start: '01/04/2019', end: '31/03/2020', partTimeHours: 1620 },
    { empId: 2, start: '01/04/2020', end: '31/03/2021', partTimeHours: 1799 },
    { empId: 2, start: '01/04/2021', end: '31/03/2022', partTimeHours: 1762 },
    { empId: 2, start: '01/04/2022', end: '31/03/2023', partTimeHours: 1799 },
    { empId: 2, start: '01/04/2023', end: '31/03/2024', partTimeHours: 1799 },
    { empId: 2, start: '01/04/2024', end: '31/03/2025', partTimeHours: 1799 },

    { empId: 3, start: '01/04/2015', end: '31/03/2016', partTimeHours: 82 },
    { empId: 3, start: '01/04/2016', end: '31/03/2017', partTimeHours: 103 },
    { empId: 3, start: '01/04/2017', end: '31/03/2018', partTimeHours: 38 },
    { empId: 3, start: '01/04/2018', end: '31/03/2019', partTimeHours: 357 },
    { empId: 3, start: '01/04/2019', end: '31/03/2020', partTimeHours: 177 },
    { empId: 3, start: '01/04/2020', end: '31/03/2021', partTimeHours: 53 },
    { empId: 3, start: '01/04/2021', end: '31/03/2022', partTimeHours: 193 },

    // Error row
    { empId: 3, start: '01/04/2022', end: '31/03/2023', partTimeHours: 156, error: true }
];

const leData = [
    { preRemedyId: 1, remedyId: 2, postRemedyId: null },
    { preRemedyId: 3, remedyId: 5, postRemedyId: null }
];

