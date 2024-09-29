export const createDate = (payload, message) => {
  let day = new Date(payload.data.drinkingTime).getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let month = new Date(payload.data.drinkingTime).getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  const year = new Date(payload.data.drinkingTime).getFullYear();

  const mes = `${message}:
        ${day}-${month}-${year}`;
  return mes;
};
