import {
  calculateProfit,
  updateStock,
  canSeeCost,
  isValidSale,
  getStockStatus
} from "../utils/inventory";

test("profit is sell - cost", () => {
  expect(calculateProfit(100, 60)).toBe(40);
});

test("stock reduces after sale", () => {
  expect(updateStock(50, 5)).toBe(45);
});

test("admin can see cost", () => {
  expect(canSeeCost({ role: "admin" })).toBe(true);
});

test("staff cannot see cost", () => {
  expect(canSeeCost({ role: "staff" })).toBe(false);
});

test("reject zero quantity", () => {
  expect(isValidSale(0)).toBe(false);
});

test("low stock alert", () => {
  expect(getStockStatus(5)).toBe("low");
});
