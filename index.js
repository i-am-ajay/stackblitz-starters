const express = require('express');
const { resolve } = require('path');
let cors = require("cors")

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors())

let taxRate = 5; // 5%
let discountPercentage = 10; // 10%
let loyaltyRate = 2; // 2 points per $

// get cart total

function cartTotal(newItemPrice, cartTotal) {
  return (cartTotal + newItemPrice).toString();
}

app.get('/cart-total', (req, res) => {
  let total = parseFloat(req.query.cartTotal);
  let newItemPrice = parseFloat(req.query.newItemPrice);
  res.send(cartTotal(newItemPrice,total));
});

// membership discount
function cartValue(cartValue, isMember){
  let finalPrice = 0.0
  if(isMember == "true"){
    finalPrice = cartValue - (cartValue * discountPercentage /100)
  }
  else{
      finalPrice = cartValue
  }
  return finalPrice.toString()
}
app.get('/membership-discount', (req, res) => {
  let total = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember;
  res.send(cartValue(total, isMember));
});

// tax on cart total
function calculateTax(cartTotal){
  return cartTotal * taxRate / 100
}

app.get("/calculate-tax",(req,res)=>{
  let cartTotal = req.query.cartTotal
  res.send(calculateTax(cartTotal).toString())
})

// delivery time
function deliveryTime(shippingMethod, distance){
  let deliveryDays = 0;
  if(shippingMethod == 'Standard'){
      deliveryDays = distance / 50
  }
  else{
    deliveryDays = distance / 100
  }
  return deliveryDays.toString()
}
app.get("/estimate-delivery",(req,res)=>{
  let distance = req.query.distance
  let shippingMethod = req.query.shippingMethod
  distance = parseFloat(distance)
  res.send(deliveryTime(shippingMethod,distance))
})

// shipping cost
function shippingCost(weight, distance){
  return (weight * distance * 0.1).toString()
}
app.get("/shipping-cost",(req,res) =>{
  let weight = parseFloat(req.query.weight)
  let distance = parseFloat(req.query.distance)
  res.send(shippingCost(weight, distance))
})

// loyalty points earned
function getLoyaltyPoints(purchaseAmount){
  return (purchaseAmount * loyaltyRate).toString()
}
app.get("/loyalty-points",(req,res) =>{
  let purchaseAmount = parseFloat(req.query.purchaseAmount)
  res.send(getLoyaltyPoints(purchaseAmount))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
