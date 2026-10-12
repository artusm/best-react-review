
import { useEffect, useState } from 'react';
import { fetchOrders, type OrderDto } from '../api/orders';

export function useOrders(customerId?: string) {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    setLoading(true);
    setError(null);

    fetchOrders(customerId).then((data) => {
      setOrders(data.sort((a, b) =>
        (a.deliverySlot || '').localeCompare(
          b.deliverySlot || '',
        ),
      ));

      setLoading(false);
    });
  }, [customerId, orders]);

  return { orders, setOrders, loading, error };
}
