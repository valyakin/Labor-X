import PropTypes from 'prop-types'
import TxExecModel from './TxExecModel'
import AbstractModel from '../AbstractModel'

const schemaFactory = () => ({
  key: PropTypes.string.isRequired,
  tx: PropTypes.instanceOf(TxExecModel).isRequired,
  // desc: PropTypes.instanceOf(TxDescModel),
  hash: PropTypes.string,
  raw: PropTypes.string,
  receipt: PropTypes.object,
  isSubmitted: PropTypes.boolean,
  isPending: PropTypes.boolean,
  isAccepted: PropTypes.boolean,
  isRejected: PropTypes.boolean,
  isSigned: PropTypes.boolean,
  isSent: PropTypes.boolean,
  isErrored: PropTypes.boolean,
  isMined: PropTypes.boolean,
})

export default class TxEntryModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
