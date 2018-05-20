import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  hash: PropTypes.string.isRequired, // ipfs hash of the object itself
  headline: PropTypes.string,
  intro: PropTypes.string,
  responsibilities: PropTypes.string,
  requirements: PropTypes.string,
  conclusion: PropTypes.string,
})

const defaultProps = {
  hash: 'QmQvFxiLGSsEsV9awy8RmyJfKZtySkFDVkDpNerbTHhHD6',
  headline: 'Default Job Name',
  intro: 'Default job intro',
  responsibilities: 'Default job responsibilities',
  requirements: 'Default job requirements',
  conclusion: 'Default job conclusion',
}

export default class JobIPFSModel extends AbstractModel {
  constructor (props) {
    super(Object.assign(defaultProps, props), schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
