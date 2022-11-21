const checkMarks = (marks) => {
    let grade_point, letter_grade;
    let obj = {};
    if (marks >= 80 && marks <= 100) {
        grade_point = 4.00;
        letter_grade = 'A+';
    }
    else if (marks >= 75 && marks < 80) {
        grade_point = 3.75;
        letter_grade = 'A';
    }
    else if (marks >= 70 && marks < 75) {
        grade_point = 3.50;
        letter_grade = 'A-';
    }
    else if (marks >= 65 && marks < 70) {
        grade_point = 3.25;
        letter_grade = 'B+';
    }
    else if (marks >= 60 && marks < 65) {
        grade_point = 3.00;
        letter_grade = 'B';
    }
    else if (marks >= 55 && marks < 60) {
        grade_point = 2.75;
        letter_grade = 'B-';
    }
    else if (marks >= 50 && marks < 55) {
        grade_point = 2.50;
        letter_grade = 'C+';
    }
    else if (marks >= 45 && marks < 50) {
        grade_point = 2.25;
        letter_grade = 'C';
    }
    else if (marks >= 40 && marks < 45) {
        grade_point = 2.00;
        letter_grade = 'D';
    }
    else {
        grade_point = 0.00;
        letter_grade = 'F';
    }
    obj.gp = grade_point;
    obj.lg = letter_grade;

    return obj;
}

export default checkMarks;