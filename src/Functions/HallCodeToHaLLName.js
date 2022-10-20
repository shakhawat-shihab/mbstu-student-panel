const checkHallName = (hallCode) => {
    let hallName = "";
    if (hallCode === 'BSMRH')
        hallName = "Bangabandhu Sheikh Mujibur Rahman Hall";
    else if (hallCode === 'JAMH')
        hallName = "Jananeta Abdul Mannan Hall";
    else if (hallCode === 'SJRH')
        hallName = "Shahid Jiaur Rahman Hall";
    else if (hallCode === 'SRH')
        hallName = "Sheikh Rasel Hall";
    else if (hallCode === 'SJJIH')
        hallName = "Shaheed Janani Jahanara Imam Hall";
    else if (hallCode === 'AKBH')
        hallName = "Alema Khatun Bhashani Hall";
    else
        hallName = hallCode;
    return hallName;
}
export default checkHallName;