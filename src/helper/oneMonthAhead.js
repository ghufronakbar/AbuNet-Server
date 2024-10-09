const oneMonthAhead = (date) => {
    if (date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    } else {
        return "-";
    }
}


export default oneMonthAhead