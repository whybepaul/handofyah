import { Order } from '@/lib/types'

type Props = {
  orders: Order[]
}

const STATUS_STYLES: Record<Order['status'], string> = {
  pending: 'bg-amber/20 text-amber-800',
  paid: 'bg-sage/20 text-sage',
  shipped: 'bg-stone/40 text-umber',
  delivered: 'bg-sage/30 text-sage',
  cancelled: 'bg-terracotta/20 text-terracotta',
}

const STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function OrderList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="font-display text-display-sm text-taupe">No orders yet</p>
        <a
          href="/shop"
          className="btn-text text-terracotta underline underline-offset-2 hover:text-umber transition-colors"
        >
          Browse the shop
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <table className="hidden w-full sm:table">
        <thead>
          <tr className="border-b border-umber/10">
            <th className="label-text pb-3 text-left font-medium">Date</th>
            <th className="label-text pb-3 text-left font-medium">Order</th>
            <th className="label-text pb-3 text-left font-medium">Status</th>
            <th className="label-text pb-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-umber/10">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="py-4 font-body text-sm text-taupe">
                {formatDate(order.createdAt)}
              </td>
              <td className="py-4 font-body text-sm text-umber font-mono">
                #{order.id.slice(-8).toUpperCase()}
              </td>
              <td className="py-4">
                <span
                  className={`inline-block rounded-full px-3 py-0.5 font-body text-xs font-medium ${STATUS_STYLES[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </td>
              <td className="py-4 font-body text-sm text-umber text-right">
                ${order.total.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile list */}
      <ul className="sm:hidden divide-y divide-umber/10">
        {orders.map((order) => (
          <li key={order.id} className="py-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm font-mono text-umber">
                #{order.id.slice(-8).toUpperCase()}
              </span>
              <span className="font-body text-sm text-umber">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-block rounded-full px-3 py-0.5 font-body text-xs font-medium ${STATUS_STYLES[order.status]}`}
              >
                {STATUS_LABELS[order.status]}
              </span>
              <span className="font-body text-xs text-taupe">{formatDate(order.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
