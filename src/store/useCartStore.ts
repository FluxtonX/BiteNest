import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/models';

interface CartState {
  items: CartItem[];
  couponCode: string;
  discountPercentage: number;
  addItem: (product: Product, quantity?: number, selectedOptions?: string[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getDeliveryFee: (baseFee: number, freeThreshold: number) => number;
  getGrandTotal: (baseFee: number, freeThreshold: number, taxRate: number) => number;
  generateWhatsAppMessage: (
    customerName: string,
    customerPhone: string,
    deliveryAddress: string,
    notes: string,
    restaurantPhone: string,
    currencySymbol: string,
    baseFee: number,
    freeThreshold: number,
    taxRate: number
  ) => string;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      discountPercentage: 0,

      addItem: (product, quantity = 1, selectedOptions = []) => {
        set((state) => {
          const existingIdx = state.items.findIndex((i) => i.product.id === product.id);
          const priceToUse = product.discountPrice || product.price;

          if (existingIdx > -1) {
            const updated = [...state.items];
            const newQty = updated[existingIdx].quantity + quantity;
            updated[existingIdx] = {
              ...updated[existingIdx],
              quantity: newQty,
              itemTotal: newQty * priceToUse,
            };
            return { items: updated };
          } else {
            return {
              items: [
                ...state.items,
                {
                  product,
                  quantity,
                  selectedOptions,
                  itemTotal: quantity * priceToUse,
                },
              ],
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) => {
            if (i.product.id === productId) {
              const unitPrice = i.product.discountPrice || i.product.price;
              return {
                ...i,
                quantity,
                itemTotal: quantity * unitPrice,
              };
            }
            return i;
          }),
        }));
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === 'WELCOME20') {
          set({ couponCode: 'WELCOME20', discountPercentage: 20 });
          return true;
        } else if (cleanCode === 'FREEDEL') {
          set({ couponCode: 'FREEDEL', discountPercentage: 10 });
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ couponCode: '', discountPercentage: 0 });
      },

      clearCart: () => {
        set({ items: [], couponCode: '', discountPercentage: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.itemTotal, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        return (subtotal * get().discountPercentage) / 100;
      },

      getDeliveryFee: (baseFee, freeThreshold) => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= freeThreshold) return 0;
        return baseFee;
      },

      getGrandTotal: (baseFee, freeThreshold, taxRate) => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscountAmount();
        const delivery = get().getDeliveryFee(baseFee, freeThreshold);
        const taxable = subtotal - discount;
        const tax = (taxable * taxRate) / 100;
        return Math.max(0, taxable + delivery + tax);
      },

      generateWhatsAppMessage: (
        customerName,
        customerPhone,
        deliveryAddress,
        notes,
        restaurantPhone,
        currencySymbol,
        baseFee,
        freeThreshold,
        taxRate
      ) => {
        const { items } = get();
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const delivery = get().getDeliveryFee(baseFee, freeThreshold);
        const grandTotal = get().getGrandTotal(baseFee, freeThreshold, taxRate);

        let text = `👋 *NEW FOOD ORDER*\n\n`;
        text += `*Order Items:*\n`;

        items.forEach((item, index) => {
          const unitPrice = item.product.discountPrice || item.product.price;
          text += `${index + 1}. *${item.product.name}* × ${item.quantity} (${currencySymbol}${(unitPrice * item.quantity).toFixed(2)})\n`;
        });

        text += `\n------------------------------\n`;
        text += `*Subtotal:* ${currencySymbol}${subtotal.toFixed(2)}\n`;
        if (discount > 0) {
          text += `*Discount (${get().discountPercentage}%):* -${currencySymbol}${discount.toFixed(2)}\n`;
        }
        text += `*Delivery Fee:* ${delivery === 0 ? 'FREE' : `${currencySymbol}${delivery.toFixed(2)}`}\n`;
        text += `*Grand Total:* *${currencySymbol}${grandTotal.toFixed(2)}*\n`;
        text += `------------------------------\n\n`;

        text += `👤 *Customer Details:*\n`;
        text += `• *Name:* ${customerName}\n`;
        text += `• *Phone:* ${customerPhone}\n`;
        text += `• *Delivery Address:* ${deliveryAddress}\n`;
        if (notes.trim()) {
          text += `• *Additional Notes:* ${notes}\n`;
        }

        text += `\nThank you! Please confirm my order.`;

        const encoded = encodeURIComponent(text);
        const cleanPhone = restaurantPhone.replace(/[^\d]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encoded}`;
      },
    }),
    {
      name: 'sizzle_cart_store',
    }
  )
);
