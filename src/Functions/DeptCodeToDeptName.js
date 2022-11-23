
const checkDepartmentName = (departmentCode) => {
    let departmentName = "";
    if (departmentCode === "cse")
        departmentName = "Computer Science and Engineering";
    else if (departmentCode === "ict")
        departmentName = "Information and Communication Technology";
    else if (departmentCode === "te")
        departmentName = "Textile Engineering";
    else if (departmentCode === "me")
        departmentName = "Mechanical Engineering";
    else if (departmentCode === "esrm")
        departmentName = "Environmental Science and Resource Management";
    else if (departmentCode === "cps")
        departmentName = "Criminology and Police Science";
    else if (departmentCode === "ftns")
        departmentName = "Food Technology and Nutritional Science";
    else if (departmentCode === "bge")
        departmentName = "Biotechnology and Genetic Engineering";
    else if (departmentCode === "bmb")
        departmentName = "Biochemistry and Molecular Biology";
    else if (departmentCode === "phar")
        departmentName = "Pharmacy";
    else if (departmentCode === "chem")
        departmentName = "Chemistry";
    else if (departmentCode === "math")
        departmentName = "Mathematics";
    else if (departmentCode === "phy")
        departmentName = "Physics";
    else if (departmentCode === "stat")
        departmentName = "Statistics";
    else if (departmentCode === "bba")
        departmentName = "Business Administration";
    else if (departmentCode === "acc")
        departmentName = "Accounting";
    else if (departmentCode === "mng")
        departmentName = "Management";
    else if (departmentCode === "eco")
        departmentName = "Economics";
    else if (departmentCode === "eng")
        departmentName = "English";
    else
        departmentName = departmentCode;
    return departmentName;
}

export default checkDepartmentName;