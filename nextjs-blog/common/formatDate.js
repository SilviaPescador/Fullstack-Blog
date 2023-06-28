export default function formatDate(date, includeTime = false) {
      const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: includeTime ? "2-digit" : undefined,
            minute: includeTime ? "2-digit" : undefined,
            second: includeTime ? "2-digit" : undefined,
      };
      return new Date(date).toLocaleDateString("es-ES", options);
}
