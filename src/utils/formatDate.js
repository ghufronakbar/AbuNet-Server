/**
 * 
 * @param dateString - Tanggal dalam format "YYYY-MM-DDTHH:mm:ss.000Z"
 * @returns String dengan format "Dayname, DD MMMM YYYY"
 */
const formatDate = (dateString) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];
    const date = new Date(dateString);

    const dayName = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
};

export default formatDate;

