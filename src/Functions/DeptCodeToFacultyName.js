const checkFacultyame = (departmentCode) => {
    let facultyName = ""
    if (departmentCode == 'cse' || departmentCode == 'ict' || departmentCode == 'txe' || departmentCode == 'me')
        facultyName = "Engineering";
    if (departmentCode == 'esrm' || departmentCode == 'cps' || departmentCode == 'bge' || departmentCode == 'ftns' || departmentCode == 'bmb' || departmentCode == 'phar')
        facultyName = "Life Science";
    if (departmentCode == 'chem' || departmentCode == 'math' || departmentCode == 'phy' || departmentCode == 'stat')
        facultyName = "Science";
    if (departmentCode == 'bba' || departmentCode == 'acc' || departmentCode == 'mng')
        facultyName = "Business Studies";
    if (departmentCode == 'eco')
        facultyName = "Social Science"
    if (departmentCode == 'eng')
        facultyName = "Arts"

    return facultyName;

}

export default checkFacultyame;