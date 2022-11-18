const findClosestTwoMarksAvg = (a = 0, b = 0, c = 0) => {
    const arr = [(a - b) ** 2, (b - c) ** 2, (c - a) ** 2];

    let dif = 10000;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        //count s
        let s = 0;
        if (i === 0) {
            s = a + b;
        }
        else if (i === 1) {
            s = b + c;
        }
        else if (i === 2) {
            s = c + a;
        }

        if (arr[i] < dif) {
            dif = arr[i];
            sum = s;

        }
        if (arr[i] === dif && s > sum) {
            sum = s;
        }
    }
    return Math.round(sum / 2);
}

export default findClosestTwoMarksAvg;