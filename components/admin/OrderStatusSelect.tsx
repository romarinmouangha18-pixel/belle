"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/orders/actions";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const onChange = (e: any) => {
    const next = e.target.value;
    start(async () => {
      try {
        await updateOrderStatus(orderId, next);
        router.refresh();
      } catch (err: any) {
        alert(err.message);
      }
    });
  };

  return (
    <select
      defaultValue={current}
      onChange={onChange}
      disabled={pending}
      className="text-xs border border-rosepastel-200 rounded-full px-2 py-1 bg-white disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
