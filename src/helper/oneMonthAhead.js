const oneMonthAhead = (date) => {    
    return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export default oneMonthAhead