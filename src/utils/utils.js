export function formatNumber(number) {
  if (isNaN(number)) {
    return "";
  } else {
    return `$ ${number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}`;
  }
}
export function formatPercentage(number) {
  if (isNaN(number)) {
    return "";
  } else {
    return `${number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")} %`;
  }
}
