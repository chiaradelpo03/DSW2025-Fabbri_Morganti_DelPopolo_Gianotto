// src/routes/checkout.js
const express = require("express");
const router = express.Router();
const { createStripeCheckout } = require("../controllers/checkoutController");

// Endpoint para crear una sesión de pago con Stripe
router.post("/", createStripeCheckout);

module.exports = router;
