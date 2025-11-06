// controllers/checkoutController.js
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

exports.createStripeCheckout = async (req, res) => {
  try {
    const { items = [] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Debes enviar items válidos" });
    }

    // ✅ CREA SESIÓN EN PESOS ARGENTINOS (ARS)
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"], // ⬅️ fuerza pago con tarjeta
      line_items: items.map((it) => ({
        price_data: {
          currency: "ars", // ⬅️ PESOS ARGENTINOS
          product_data: { name: it.title || "Producto" },
          unit_amount: Math.round(Number(it.unit_price) * 100), // Stripe usa centavos
        },
        quantity: Number(it.quantity) || 1,
      })),
      success_url: `${process.env.FRONTEND_ORIGIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_ORIGIN}/cancel`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("❌ Stripe error:", err.message || err);
    res.status(500).json({ error: "No se pudo crear la sesión de pago" });
  }
};