export function formatTime(
  ms: number | null,
  precision: 0 | 1 | 2 | 3 = 2,
  format: "decimal" | "colon" = "decimal",
): string {
  if (ms === null || ms === Infinity || ms < 0 || Number.isNaN(ms)) return "--";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const msPart = ms % 1000;

  let decimalStr = "";

  if (precision > 0) {
    const divisor = 10 ** (3 - precision);
    const decimalPart = Math.floor(msPart / divisor);
    decimalStr = `.${decimalPart.toString().padStart(precision, "0")}`;
  }

  if (format === "colon") {
    const displayMins = minutes.toString().padStart(hours > 0 ? 2 : 1, "0");
    const displaySecs = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${displayMins}:${displaySecs}${decimalStr}`;
    }

    if (minutes > 0) {
      return `${minutes}:${displaySecs}${decimalStr}`;
    }

    return `${seconds}${decimalStr}`;
  }

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}${decimalStr}`;
  }

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}${decimalStr}`;
  }

  return `${seconds}${decimalStr}`;
}
