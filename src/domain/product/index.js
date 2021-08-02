const calculateProductDiscount = (amount, percentageDiscount) => {
  const amountNumber = Number(amount)
  const percentageDiscountNumber = Number(percentageDiscount)

  if (Number.isNaN(amountNumber)) {
    throw new Error('Amount argument must be a number')
  }

  if (Number.isNaN(percentageDiscountNumber)) {
    throw new Error('Percentage discount argument must be a number')
  }

  const percentageDiscountNumberFixed = Number(
    percentageDiscountNumber.toFixed(2)
  )

  return amountNumber * percentageDiscountNumberFixed
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
  calculateProductDiscount,
  createProductObject,
}
