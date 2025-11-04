// src/controllers/checkoutController.js
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

function mapLineItems(items = []) {
  return items.map((it) => {
    const name = String(it.title ?? it.name ?? "").trim();
    const unit = Number(it.unit_price ?? it.price);
    const qty  = Number(it.quantity ?? 1);
    if (!name || !Number.isFinite(unit) || unit <= 0 || !Number.isFinite(qty) || qty <= 0) {
      throw new Error("Item inválido");
    }
    return {
      price_data: {
        currency: "usd",
        product_data: { name },
        unit_amount: Math.round(unit * 100),
      },
      quantity: Math.trunc(qty),
    };
  });
}

async function createStripeCheckout(req, res) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items inválidos" });
    }

    const line_items = mapLineItems(items);
    const FRONT = process.env.FRONTEND_ORIGIN || "http://localhost:4200";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${FRONT}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${FRONT}/failure`,
      metadata: { source: "my-shop" },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err.message || err);
    return res.status(500).json({ error: "No se pudo crear el checkout" });
  }
}

module.exports = { createStripeCheckout };
