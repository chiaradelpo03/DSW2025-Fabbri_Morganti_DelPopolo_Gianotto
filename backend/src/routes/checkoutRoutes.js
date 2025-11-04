// src/routes/checkoutRoutes.js
const express = require("express");
const router = express.Router();

// RUTA RELATIVA: si tu controller está en src/controllers/checkoutController.js,
// desde src/routes/checkoutRoutes.js hay que subir un nivel:
const { createStripeCheckout } = require("../controllers/checkoutController");

// DEBUG: confirmá que es function
console.log("typeof createStripeCheckout:", typeof createStripeCheckout); // debe imprimir "function"

router.post("/", createStripeCheckout);

module.exports = router;
