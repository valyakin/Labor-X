import PropTypes from 'prop-types'
import faker from 'faker'
import ClientAddressModel from './ClientAddressModel'
import * as ClientType from './ClientTypeModel'
import AbstractModel from '../AbstractModel'

const { CLIENT_TYPES_LIST } = ClientType
const ClientTypeModel = ClientType.default

const schemaFactory = () => ({
  hash: PropTypes.string.isRequired, // ipfs hash of the object itself
  name: PropTypes.string, // do not use this field - use from according ProfileModel
  logo: PropTypes.string, // do not use this field - use from according ProfileModel
  registered: PropTypes.instanceOf(Date),
  website: PropTypes.string,
  email: PropTypes.string,
  description: PropTypes.string,
  address: PropTypes.instanceOf(ClientAddressModel),
  type: PropTypes.instanceOf(ClientTypeModel),
})

export default class ClientIPFSModel extends AbstractModel {
  constructor (props) {
    super(propsWithDefaults(props), schemaFactory())
    Object.assign(this, propsWithDefaults(props))
    Object.freeze(this)
  }
}

function propsWithDefaults (props) {
  return Object.assign({}, {
    hash: faker.random.uuid(),
    name: faker.company.companyName(),
    registered: props.registered ? new Date(props.registered) : new Date(faker.date.past()),
    website: faker.internet.url(),
    email: faker.internet.email(),
    description: faker.lorem.sentence(20),
    logo: faker.internet.avatar(),
    address: new ClientAddressModel(props.address || {}),
    type: faker.random.arrayElement(CLIENT_TYPES_LIST),
  }, props)
}
