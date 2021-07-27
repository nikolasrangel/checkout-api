const path = require('path')
const test = require('ava')
const { stub } = require('sinon')

const grpcClient = require('../grpc')
const {
  createDiscountClient,
  defaultClientOptions,
  getProductPercentageDiscount,
} = require('./index')

test('createDiscountClient > should throw an error when discount server address is not defined', (t) => {
  try {
    createDiscountClient()
  } catch (error) {
    t.is(error.message, 'Server discount address argument must be a string')

    return t.pass()
  }

  return t.fail()
})

test('createDiscountClient > should throw an error when discount server address is not a string', (t) => {
  try {
    createDiscountClient(null)
  } catch (error) {
    t.is(error.message, 'Server discount address argument must be a string')

    return t.pass()
  }

  return t.fail()
})

test('createDiscountClient > should throw an error when options argument does not contain all properties', (t) => {
  const optionsWithoutServiceName = {
    packageName: 'discount',
    protoFileName: 'discount',
  }

  try {
    createDiscountClient('http://localhost:50051', optionsWithoutServiceName)
  } catch (error) {
    t.is(
      error.message,
      'Argument "options" must be an object with the following properties: packageName, serviceName, protoFileName'
    )

    return t.pass()
  }

  return t.fail()
})

test('createDiscountClient > should successfully call "createClient" with default options when options argument is not passed', (t) => {
  // enforce to "createClient" grpc function returns its call arguments
  const grpcCreateClientStub = stub(grpcClient, 'createClient').callsFake(
    (clientOptions, serverAddress) => ({ ...clientOptions, serverAddress })
  )

  const client = createDiscountClient('http://localhost:50051')

  t.is(client.packageName, defaultClientOptions.packageName)
  t.is(client.serviceName, defaultClientOptions.serviceName)
  t.is(client.serverAddress, 'http://localhost:50051')

  grpcCreateClientStub.restore()
})

test('createDiscountClient > should successfully call "createClient" with the options argument passed', (t) => {
  // enforce to grpc "createClient" function returns its call arguments
  const grpcCreateClientStub = stub(grpcClient, 'createClient').callsFake(
    (clientOptions, serverAddress) => ({ ...clientOptions, serverAddress })
  )

  // stubs for the others dependencies
  const pathResolveStub = stub(path, 'resolve').returns(
    'fake/proto/absolute/path'
  )
  const grpcLoadPackageDefinitionStub = stub(
    grpcClient,
    'loadPackageDefinition'
  ).returns({
    'discount.GetDiscountRequest': {
      format: 'Protocol Buffer 3 DescriptorProto',
    },
  })

  const clientOptions = {
    packageName: 'new-discount-package-name',
    serviceName: 'Discount',
    protoFileName: 'new-discount-proto',
  }

  const client = createDiscountClient(
    'http://fake-grpc-server:50051',
    clientOptions
  )

  t.is(client.packageName, clientOptions.packageName)
  t.is(client.serviceName, clientOptions.serviceName)
  t.is(client.serverAddress, 'http://fake-grpc-server:50051')

  grpcCreateClientStub.restore()
  pathResolveStub.restore()
  grpcLoadPackageDefinitionStub.restore()
})

test('defaultClientOptions > should return the default values for discount service', (t) => {
  t.deepEqual(defaultClientOptions, {
    packageName: 'discount',
    serviceName: 'Discount',
    protoFileName: 'discount',
  })
})

test('getProductPercentageDiscount > should successfully get an item percentage discount', async (t) => {
  const productId = 1
  const percentageDiscount = 0.05
  const clientMock = {
    getDiscount: (param, callback) =>
      callback(null, { percentage: percentageDiscount }),
  }

  const productPercentageDiscount = await getProductPercentageDiscount(
    clientMock,
    productId
  )

  t.is(productPercentageDiscount, percentageDiscount)
})

test('getProductPercentageDiscount > should throw an error when client responds with error', async (t) => {
  const errorClient = new Error('Can not communicate with gRPC server')
  const clientMock = {
    getDiscount: (param, callback) => callback(errorClient),
  }

  try {
    await getProductPercentageDiscount(clientMock)
  } catch (error) {
    t.is(error.message, 'Can not communicate with gRPC server')

    return t.pass()
  }

  return t.fail()
})

test('getProductPercentageDiscount > should throw an error when discount server response responds with wrong format', async (t) => {
  const productId = 2
  const percentageDiscount = 0.05
  const clientMock = {
    getDiscount: (param, callback) =>
      callback(null, { invalidName: percentageDiscount }),
  }

  try {
    await getProductPercentageDiscount(clientMock, productId)
  } catch (error) {
    t.is(
      error.message,
      'Discount server response does not contain percentage property'
    )

    return t.pass()
  }

  return t.fail()
})

test('getProductPercentageDiscount > should throw an error when can not communicate with client', async (t) => {
  const productId = 3
  const clientMock = {
    getDiscount: () => {
      throw new Error('getDiscount is not a function')
    },
  }

  try {
    await getProductPercentageDiscount(clientMock, productId)
  } catch (error) {
    t.is(error.message, 'getDiscount is not a function')

    return t.pass()
  }

  return t.fail()
})
