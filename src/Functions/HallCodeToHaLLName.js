const checkHallName = (hallCode) => {
    let hallName = "";
    if (hallCode === 'bsmrh')
        hallName = "Bangabandhu Sheikh Mujibur Rahman Hall";
    else if (hallCode === 'jamh')
        hallName = "Jananeta Abdul Mannan Hall";
    else if (hallCode === 'szrh')
        hallName = "Shaheed Ziaur Rahman Hall";
    else if (hallCode === 'SRH')
        hallName = "Sheikh Rasel Hall";
    else if (hallCode === 'sjjih')
        hallName = "Shaheed Janani Jahanara Imam Hall";
    else if (hallCode === 'akbh')
        hallName = "Alema Khatun Bhashani Hall";
    else
        hallName = hallCode;
    return hallName;
}
export default checkHallName;