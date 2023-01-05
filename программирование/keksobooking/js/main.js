function getRandom(min, max,  maxDigits = 0) {
  if (min > max || min < 0 || max <= 0) {
    return ('Задан неверный диапазон! Укажите другие числа.');
  }
  const digitsDegree = 10 ** maxDigits;
  return ((Math.random() * (max - min) + min) * digitsDegree) / digitsDegree;
}


