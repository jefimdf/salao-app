export const strYearToDateInitial = (str) => {
    return new Date(str, 0)
}

export const strYearToDateFinal = (str) => {
    return new Date(str, 11, 31, 23, 59, 59);
}

export const strDateUsToStrDateBr = (str) => {
    return str != null ? str.substr(0, 10).split('-').reverse().join('/') : ""
}

///Convert system date to string using dd/mm/yyyy pattern
export const serverDateToString = (date) => {
    var data = new Date(date),
        dia = data.getDate().toString(),
        diaF = (dia.length === 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(),
        mesF = (mes.length === 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}

///Convert system date to string using dd/mm/yyyy pattern
export const dateToStringAmericano = (date) => {
    var data = new Date(date),
        dia = data.getDate().toString(),
        diaF = (dia.length === 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(),
        mesF = (mes.length === 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return anoF + "-" + mesF + "-" + diaF;
}