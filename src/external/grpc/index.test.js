const path = require('path')
const test = require('ava')
const { spy } = require('sinon')

const {
  closeClient,
  loadPackageDefinition,
  loadPackgeObject,
  createClient,
} = require('./index')

test('closeClient > should call the client close function', (t) => {
  const client = {
    close: spy(),
  }

  closeClient(client)

  t.true(client.close.calledOnce)
})

test('loadPackageDefinition > should load .proto file from its absolute path', (t) => {
  const protoLoaderSpy = {
    loadSync: spy(),
  }

  const protoFileRelativePath = './fake.proto'
  const protoFileAbsolutePath = path.resolve(__dirname, protoFileRelativePath)

  loadPackageDefinition(protoFileRelativePath, protoLoaderSpy)

  const { firstArg: protoLoaderPathCall } = protoLoaderSpy.loadSync.firstCall

  t.true(protoLoaderSpy.loadSync.calledOnce)
  t.is(protoLoaderPathCall, protoFileAbsolutePath)
})

test('loadPackageDefinition > should throw an error when proto path argument is not defined', (t) => {
  try {
    loadPackageDefinition()
  } catch (error) {
    t.is(error.message, 'Argument "protoPath" must be a string')

    return t.pass()
  }

  t.fail()
})

test('loadPackageDefinition > should throw an error when proto path argument is not a string', (t) => {
  try {
    loadPackageDefinition(42)
  } catch (error) {
    t.is(error.message, 'Argument "protoPath" must be a string')

    return t.pass()
  }

  t.fail()
})

test('loadPackgeObject > should call the grpc client load package definition function', (t) => {
  const grpcClientSpy = {
    loadPackageDefinition: spy(),
  }

  const fakePackageDefinition = {
    'discount.GetDiscountRequest': {
      format: 'Protocol Buffer 3 DescriptorProto',
      type: {},
      fileDescriptorProtos: {},
    },
  }

  loadPackgeObject(fakePackageDefinition, grpcClientSpy)

  const { firstArg: packageDefinitionCall } =
    grpcClientSpy.loadPackageDefinition.firstCall

  t.true(grpcClientSpy.loadPackageDefinition.calledOnce)
  t.deepEqual(packageDefinitionCall, fakePackageDefinition)
})

test('loadPackgeObject > should throw an error when package definition argument is not defined', (t) => {
  try {
    loadPackgeObject()
  } catch (error) {
    t.is(error.message, 'Argument "packageDefinition" must be an object')

    return t.pass()
  }

  t.fail()
})

test('loadPackgeObject > should throw an error when package definition argument is not an object', (t) => {
  try {
    loadPackgeObject('not an object')
  } catch (error) {
    t.is(error.message, 'Argument "packageDefinition" must be an object')

    return t.pass()
  }

  t.fail()
})

test('createClient > should throw an error when options argument is not defined', (t) => {
  try {
    createClient()
  } catch (error) {
    t.is(
      error.message,
      'Argument "options" must be an object with the following properties: packageDefinition, packageName, serviceName'
    )

    return t.pass()
  }

  t.fail()
})

test('createClient > should throw an error when options argument does not contain all properties', (t) => {
  const optionsMissingPackageName = {
    packageDefinition: {},
    serviceName: 'fake-service-name',
  }

  try {
    createClient(optionsMissingPackageName)
  } catch (error) {
    t.is(
      error.message,
      'Argument "options" must be an object with the following properties: packageDefinition, packageName, serviceName'
    )

    return t.pass()
  }

  t.fail()
})

test('createClient > should throw an error when options argument is not an object', (t) => {
  try {
    createClient('not an object')
  } catch (error) {
    t.is(
      error.message,
      'Argument "options" must be an object with the following properties: packageDefinition, packageName, serviceName'
    )

    return t.pass()
  }

  t.fail()
})

test('createClient > should throw an error when grpc server address argument is not defined', (t) => {
  const fakeOptions = {
    packageDefinition: {},
    packageName: 'fake-package-name',
    serviceName: 'fake-service-name',
  }

  try {
    createClient(fakeOptions)
  } catch (error) {
    t.is(error.message, 'gRPC server address argument must be a string')

    return t.pass()
  }

  t.fail()
})
