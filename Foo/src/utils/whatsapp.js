/**
 * Generates formatted plain text list for selected grocery items.
 * @param {Array<{ name: string, quantity: number, unit: string }>} selectedItems
 * @returns {string} Formatted WhatsApp message
 */
export function generateWhatsAppMessage(selectedItems) {
  if (!selectedItems || selectedItems.length === 0) {
    return "";
  }

  const header = "🛒 *Grocery List*\n\n";
  const itemsList = selectedItems
    .map((item, index) => {
      const nameDisplay = item.tamilName ? `${item.name} (${item.tamilName})` : item.name;
      return `${index + 1}. ${nameDisplay} - ${item.quantity} ${item.unit}`;
    })
    .join("\n");
  const footer = "\n\nPlease buy these items.\nThank you ❤️";

  return `${header}${itemsList}${footer}`;
}

/**
 * Creates WhatsApp deep link URL. Supports optional phone number for direct contact messaging.
 * @param {string} message - Unencoded formatted message text
 * @param {string} [phoneNumber] - Optional contact phone number
 * @returns {string} Full WhatsApp URL
 */
export function generateWhatsAppLink(message, phoneNumber = "") {
  const encodedMessage = encodeURIComponent(message);
  const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, "") : "";

  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  return `https://wa.me/?text=${encodedMessage}`;
}

/**
 * Copies formatted list text to system clipboard.
 * @param {Array<{ name: string, quantity: number, unit: string }>} selectedItems
 * @returns {Promise<boolean>} True if successful
 */
export async function copyShoppingList(selectedItems) {
  const message = generateWhatsAppMessage(selectedItems);
  if (!message) return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(message);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = message;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error("Failed to copy list: ", err);
    return false;
  }
}
