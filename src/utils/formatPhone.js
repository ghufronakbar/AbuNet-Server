const formatPhone = (phone) => {
    if (phone) {
        return phone
            .replace(/[^0-9]/g, "")
            .replace(/^0/, '62')
            .replace(/(\d{2})(\d{4})(\d{4})/, "+$1 $2-$3");
    }
    return "Belum diisi";
};

export default formatPhone;
