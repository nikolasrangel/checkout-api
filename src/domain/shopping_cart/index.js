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

const removeInvalidProducts = (products) => {
  return products.filter((product) => product && typeof product === 'object')
}

const createShoppingCart = (products) => {
  const validProducts = removeInvalidProducts(products)

  const totalAmount = calculateTotalAmount(validProducts)
  const totalDiscount = calculateTotalDiscount(validProducts)
  const totalAmountWithDiscount =
    calculateTotalAmountWithDiscount(validProducts)

  return {
    total_amount: totalAmount,
    total_amount_with_discount: totalAmountWithDiscount,
    total_discount: totalDiscount,
    products: [...validProducts],
  }
}

const addProductToShoppingCart = (shoppingCart, product) => {
  if (!product || typeof product !== 'object') {
    return shoppingCart
  }

  return {
    ...shoppingCart,
    products: [...shoppingCart.products, product],
  }
}

module.exports = {
  calculateTotalAmount,
  calculateTotalAmountWithDiscount,
  calculateTotalDiscount,
  shouldAddGiftProduct,
  createShoppingCart,
  addProductToShoppingCart,
}
