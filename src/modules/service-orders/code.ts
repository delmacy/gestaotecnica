export function generateServiceOrderCode(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const time = `${String(date.getHours()).padStart(2, "0")}${String(
    date.getMinutes(),
  ).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;
  const suffix = crypto.randomUUID().slice(0, 6).toUpperCase();

  return `OS-${year}${month}${day}-${time}-${suffix}`;
}
