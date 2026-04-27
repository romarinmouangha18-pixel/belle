import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { items, shipping } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

    const total = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

    // Crée commande pending
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_price: total,
        status: "pending",
        shipping_address: shipping,
      })
      .select()
      .single();
    if (orderErr || !order) {
      return NextResponse.json({ error: orderErr?.message ?? "Erreur commande" }, { status: 500 });
    }

    await supabase.from("order_items").insert(
      items.map((i: any) => ({
        order_id: order.id,
        product_id: i.id,
        quantity: i.quantity,
        unit_price: i.price,
      }))
    );

    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email ?? undefined,
      line_items: items.map((i: any) => ({
        price_data: {
          currency: "eur",
          product_data: { name: i.name, images: i.image_url ? [i.image_url] : [] },
          unit_amount: Math.round(i.price * 100),
        },
        quantity: i.quantity,
      })),
      success_url: `${origin}/account/orders?success=1`,
      cancel_url: `${origin}/cart?canceled=1`,
      metadata: { order_id: order.id, user_id: user.id },
    });

    await supabase.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
