export function getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today; 
}
export function subtractDates(s1, s2) {
    const d1 = new Date(s1);
    const d2 = new Date(s2);
    return (d1.getDate()-d2.getDate());
}