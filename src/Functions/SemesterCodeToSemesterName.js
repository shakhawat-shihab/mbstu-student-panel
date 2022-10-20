const checkSemesterName = (semester) => {
    // console.log(semester);
    let semesterName = "";
    if (semester === 1)
        semesterName = "1st Year 1st Semester";
    else if (semester === 2)
        semesterName = "1st Year 2nd Semester";
    else if (semester === 3)
        semesterName = "2nd Year 1st Semester";
    else if (semester === 4)
        semesterName = "2nd Year 2nd Semester";
    else if (semester === 5)
        semesterName = "3rd Year 1st Semester";
    else if (semester === 6)
        semesterName = "3rd Year 2nd Semester";
    else if (semester === 7)
        semesterName = "4th Year 1st Semester";
    else if (semester === 8)
        semesterName = "4th Year 2nd Semester";
    else
        semesterName = semester;
    return semesterName;
}
export default checkSemesterName;