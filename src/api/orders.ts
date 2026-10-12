
import axios from 'axios';

export type OrderDto = {
  id: string;
  address: string;
  customerName: string;
  deliverySlot?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE';
};

export async function fetchOrders(
  customerId: string,
): Promise<OrderDto[]> {
  try {
    const { data } = await axios.get('/api/orders', {
      params: { customerId },
    });

    return data.orders;
  } catch (error) {
    console.error('Failed to fetch orders', error);
    return [];
  }
}

export async function cancelOrder(orderId: string) {
  return axios.post(`/api/orders/${orderId}/cancel`);
}
