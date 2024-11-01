// Save an item to localStorage
export const saveItemToLocalStorage = (item) => {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  if (!items.some((existingItem) => existingItem.name === item.name)) {
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
  }
};

// Remove an item from localStorage
export const removeItemFromLocalStorage = (itemName) => {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  const updatedItems = items.filter(
    (existingItem) => existingItem.name !== itemName
  );
  localStorage.setItem("items", JSON.stringify(updatedItems));
};

// Get all saved items from localStorage
export const getItemsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("items")) || [];
};
