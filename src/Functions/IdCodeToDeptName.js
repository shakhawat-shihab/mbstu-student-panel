const checkDepartmentNameFromIdCode = (id) => {
    const deptCodeFromId = id.substr(0, 2)
    let departmentName = "";
    if (deptCodeFromId === "ce")
        departmentName = "Computer Science and Engineering";
    else if (deptCodeFromId === "it")
        departmentName = "Information and Communication Technology";
    else if (deptCodeFromId === "te")
        departmentName = "Textile Engineering";
    else if (deptCodeFromId === "me")
        departmentName = "Mechanical Engineering";
    else if (deptCodeFromId === "esrm")
        departmentName = "Environmental Science and Resource Management";
    else if (deptCodeFromId === "cps")
        departmentName = "Criminology and Police Science";
    else if (deptCodeFromId === "ftns")
        departmentName = "Food Technology and Nutritional Science";
    else if (deptCodeFromId === "bge")
        departmentName = "Biotechnology and Genetic Engineering";
    else if (deptCodeFromId === "bmb")
        departmentName = "Biochemistry and Molecular Biology";
    else if (deptCodeFromId === "phar")
        departmentName = "Pharmacy";
    else if (deptCodeFromId === "chem")
        departmentName = "Chemistry";
    else if (deptCodeFromId === "math")
        departmentName = "Mathematics";
    else if (deptCodeFromId === "phy")
        departmentName = "Physics";
    else if (deptCodeFromId === "stat")
        departmentName = "Statistics";
    else if (deptCodeFromId === "bba")
        departmentName = "Business Administration";
    else if (deptCodeFromId === "acc")
        departmentName = "Accounting";
    else if (deptCodeFromId === "mng")
        departmentName = "Management";
    else if (deptCodeFromId === "eco")
        departmentName = "Economics";
    else if (deptCodeFromId === "eng")
        departmentName = "English";
    else
        departmentName = deptCodeFromId;
    return departmentName;
}

export default checkDepartmentNameFromIdCode;