export function formatDate(dateInput: string | number | Date) {
  const date = new Date(dateInput)

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}
