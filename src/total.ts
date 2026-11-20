import type { Item } from "./shop.js";

export const total = (item: Item): number => item.cents + 1;
