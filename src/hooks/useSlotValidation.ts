'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart.store';
import { isSlotStillValid } from '@/utils/timeSlots';

/**
 * useSlotValidation
 *
 * Runs on mount to check whether the persisted dessertSlot is still valid.
 * If expired, it clears the slot from the cart store and signals the component.
 *
 * Usage:
 *   const { wasExpired } = useSlotValidation();
 *   // if wasExpired → show "Your slot expired, please select a new time" banner
 */
export function useSlotValidation(): { wasExpired: boolean } {
  const dessertSlot = useCartStore(s => s.dessertSlot);
  const setDessertSlot = useCartStore(s => s.setDessertSlot);
  const setCoffeeDeliveryMode = useCartStore(s => s.setCoffeeDeliveryMode);
  const coffeeDeliveryMode = useCartStore(s => s.coffeeDeliveryMode);
  const hasDesserts = useCartStore(s => s.hasDesserts);

  const [wasExpired, setWasExpired] = useState(false);

  useEffect(() => {
    // Only validate if there's a slot saved and the cart still has desserts
    if (dessertSlot && hasDesserts() && !isSlotStillValid(dessertSlot)) {
      setDessertSlot(null);
      // If coffee mode was set, clear it too — it may need to be re-evaluated
      if (coffeeDeliveryMode !== null) {
        setCoffeeDeliveryMode(null);
      }
      setWasExpired(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  return { wasExpired };
}
