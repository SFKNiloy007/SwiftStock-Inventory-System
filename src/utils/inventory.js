export function calculateProfit(sell, cost) {
  return sell - cost;
}

export function updateStock(stock, soldQty) {
  return stock - soldQty;
}

export function canSeeCost(user) {
  return user.role === "admin";
}

export function isValidSale(qty) {
  return qty > 0;
}

export function getStockStatus(stock) {
  if (stock === 0) return "out";
  if (stock < 10) return "low";
  return "ok";
}
