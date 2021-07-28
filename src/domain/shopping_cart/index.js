const { calculateProductDiscount } = require('../discount')

const calculateTotalAmount = (products) => {
  const totalAmount = products.reduce(
    (total, product) => total + product.total_amount,
    0
  )

  return totalAmount
}

const calculateTotalAmountWithDiscount = (products) => {
  const totalAmount = calculateTotalAmount(products)
  const totalDiscount = calculateTotalDiscount(products)

  return totalAmount - totalDiscount
}

const calculateTotalDiscount = (products) => {
  const totalDiscount = products.reduce(
    (total, product) => total + product.discount,
    0
  )

  return totalDiscount
}

const shouldAddGiftProduct = (isBlackFriday) => isBlackFriday

const createShoppingCart = (products) => {
  const totalAmount = calculateTotalAmount(products)
  const totalDiscount = calculateTotalDiscount(products)
  const totalAmountWithDiscount = calculateTotalAmountWithDiscount(products)

  return {
    total_amount: totalAmount,
    total_amount_with_discount: totalAmountWithDiscount,
    total_discount: totalDiscount,
    products: [...products],
  }
}

const createProductObject = (product, discount = 0, order = {}) => {
  const { quantity } = order
  const { id, amount, is_gift: isGift } = product

  const productDiscount = calculateProductDiscount(amount, discount)
  const totalDiscount = quantity * productDiscount

  return {
    id,
    quantity: isGift ? 1 : quantity,
    unit_amount: isGift ? 0 : amount,
    total_amount: isGift ? 0 : quantity * amount,
    discount: isGift ? 0 : totalDiscount,
    is_gift: isGift || false,
  }
}

module.exports = {
  calculateTotalAmount,
  calculateTotalAmountWithDiscount,
  calculateTotalDiscount,
  shouldAddGiftProduct,
  createShoppingCart,
  createProductObject,
}