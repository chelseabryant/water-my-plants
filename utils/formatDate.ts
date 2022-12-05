export function formatDate(date: Date | null) {
    if (date) {
   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
}