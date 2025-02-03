export const getShiftedArray = <T>(
  arr: T[],
  sourceIndex: number,
  destinationIndex: number
): T[] => {
  if (
    sourceIndex < 0 ||
    sourceIndex >= arr.length ||
    destinationIndex < 0 ||
    destinationIndex >= arr.length
  ) {
    return arr
  }

  const newArr = [...arr] // Создаём копию массива
  const deleteItem = newArr.splice(sourceIndex, 1)[0]
  newArr.splice(destinationIndex, 0, deleteItem)

  return newArr // Возвращаем новый массив
}
