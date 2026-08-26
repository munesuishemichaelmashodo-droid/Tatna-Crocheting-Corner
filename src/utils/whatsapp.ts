import { CartItem, CrochetProduct } from '../types';

export function formatZimbabwePhoneForWhatsApp(phone: string): string {
  // Clean phone number: remove spaces, +, brackets, hyphens
  let cleaned = phone.replace(/[\s+()-]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '263' + cleaned.substring(1);
  } else if (!cleaned.startsWith('263')) {
    cleaned = '263' + cleaned;
  }
  return cleaned;
}

export function createDirectOrderWhatsAppUrl(
  product: CrochetProduct,
  phone: string,
  selectedColor?: string,
  quantity: number = 1
): string {
  const cleanPhone = formatZimbabwePhoneForWhatsApp(phone);
  const colorText = selectedColor ? ` (Color: ${selectedColor})` : '';
  const qtyText = quantity > 1 ? ` x ${quantity}` : '';
  const totalUSD = product.priceUSD * quantity;

  const message = `Hello Tatna! 👋🧶\nI would love to order from *Tatna Crocheting Corner*:\n\n✨ *Product:* ${product.name}${colorText}${qtyText}\n💰 *Price:* $${totalUSD} USD\n📍 *Location:* Harare / Zimbabwe Delivery\n\nPlease let me know your current turnaround time and payment details (EcoCash/USD Cash/Innbucks). Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function createCartOrderWhatsAppUrl(
  items: CartItem[],
  phone: string,
  customerName: string,
  deliveryLocation: string,
  specialNotes?: string
): string {
  const cleanPhone = formatZimbabwePhoneForWhatsApp(phone);
  const totalUSD = items.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);

  const itemListText = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}* (Color: ${item.selectedColor}, Qty: ${item.quantity}) - $${item.product.priceUSD * item.quantity} USD`
    )
    .join('\n');

  const greeting = customerName ? `Hello Tatna, my name is *${customerName}*! 👋🧶` : `Hello Tatna! 👋🧶`;
  const locationText = deliveryLocation ? `📍 *Delivery Area:* ${deliveryLocation}` : `📍 *Location:* Harare, Zimbabwe`;
  const notesText = specialNotes ? `\n📝 *Notes/Custom Request:* ${specialNotes}` : '';

  const message = `${greeting}\nI would like to place an order from *Tatna Crocheting Corner*:\n\n${itemListText}\n\n💵 *Total Order Amount:* $${totalUSD} USD\n${locationText}${notesText}\n\nPlease confirm availability and payment options (EcoCash / Innbucks / USD Cash). Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
