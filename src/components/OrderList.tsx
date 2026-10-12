
import { useMemo, useState } from 'react';
import { cancelOrder } from '../api/orders';
import { useOrders } from '../hooks/useOrders';

type Props = {
  customerId?: string;
  search?: string;
};

export function OrderList({ customerId, search = '' }: Props) {
  const { orders, setOrders, loading, error } = useOrders(customerId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      order.address.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [orders, search]);

  function highlight(value: string) {
    if (!search) return value;

    return value.replaceAll(
      search,
      `<mark>${search}</mark>`,
    );
  }

  async function handleCancel(orderId: string) {
    setOrders(orders.filter((order) => order.id !== orderId));
    await cancelOrder(orderId);
  }

  return (
    <section>
      {loading && <div>Loading...</div>}
      {error && <div role="alert">{error}</div>}

      {filteredOrders.map((order, index) => (
        <article key={index} className="order-card">
          <div
            dangerouslySetInnerHTML={{
              __html: highlight(order.address),
            }}
          />

          <p>{order.customerName}</p>
          <p>{order.deliverySlot || 'No slot'}</p>

          {order.status !== 'DONE' && (
            <button onClick={() => setSelectedId(order.id)}>
              Cancel
            </button>
          )}
        </article>
      ))}

      {selectedId && (
        <div role="dialog">
          <p>Cancel this order?</p>
          <button onClick={() => handleCancel(selectedId)}>
            Confirm
          </button>
          <button onClick={() => setSelectedId(null)}>
            Close
          </button>
        </div>
      )}
    </section>
  );
}
