const express = require("express");

const {
  createCharge,
  createCustomer,
  createSubscription,
  unsubscribeUser,
} = require("../actions/stripe");
const router = express.Router();

router.get("/stripe", (req, res) => {
  res.json("Stripe working");
});

// create a new customer
router.post("/new-customer", async (req, res) => {
  try {
    const resp = await createCustomer(req.body.email);

    res.json(resp);
  } catch (error) {
    res.status(400).json(error);
  }
});

// initiate payment from the user
router.post("/pay", async (req, res) => {
  try {
    const resp = await createCharge(req.body);
    res.json(resp);
  } catch (error) {
    res.status(400).json(error);
  }
});

// subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const resp = await createSubscription(req.body.email);
    res.json(resp);
  } catch (error) {
    res.status(400).json(error);
  }
  res.send(resp);
});

// unsubscribe
router.post("/unsubscribe", async (req, res) => {
  try {
    const response = await unsubscribeUser(req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
