const calculateProductDiscount = (amount, percentageDiscount) => {
  const amountNumber = Number(amount)
  const percentageDiscountNumber = Number(percentageDiscount)

  if (Number.isNaN(amountNumber)) {
    throw new Error('Amount argument must be a number')
  }

  if (Number.isNaN(percentageDiscountNumber)) {
    throw new Error('Percentage discount argument must be a number')
  }

  return amountNumber * percentageDiscountNumber
}

module.exports = {
  calculateProductDiscount,
}
