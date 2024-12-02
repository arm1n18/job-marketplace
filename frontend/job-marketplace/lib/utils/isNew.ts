export const isNew = (date1: string, date2: Date) => {
    const createdAtDate = new Date(date1);

    if(createdAtDate.getFullYear() === date2.getFullYear()
        && createdAtDate.getMonth() === date2.getMonth()
        && createdAtDate.getDate() === date2.getDate()
        && createdAtDate.getHours() === date2.getHours()) {
            return 'Нове'
        }
    else if (
        createdAtDate.getFullYear() === date2.getFullYear()
        && createdAtDate.getMonth() === date2.getMonth()
        && createdAtDate.getDate() === date2.getDate()) {
            return date2.getHours() - createdAtDate.getHours() + 'год'
        }
    else if (
        createdAtDate.getFullYear() === date2.getFullYear()
        && createdAtDate.getMonth() === date2.getMonth()
        && date2.getDate() - createdAtDate.getDate() === 1) {
            return 'Вчора'
        }
    else if (
        createdAtDate.getFullYear() === date2.getFullYear()
        && createdAtDate.getMonth() === date2.getMonth()
        && (date2.getDate() - createdAtDate.getDate()) <= 30) {
            return date2.getDate() - createdAtDate.getDate() + 'д'
        }
    else {
        return createdAtDate.toLocaleDateString("uk-UA", {day: "numeric", month: "long"})
    }
};