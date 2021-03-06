import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { modalsClear } from 'src/store'
import css from './ModalStack.scss'

export class ModalStack extends React.Component {
  static propTypes = {
    dispatchModalsClear: PropTypes.func.isRequired,
    stack: PropTypes.arrayOf(PropTypes.shape(
      {
        key: PropTypes.number.isRequired,
        component: PropTypes.func.isRequired,
        props: PropTypes.object,
      }
    )),
  }

  constructor (props, context){
    super(props, context)
    this.handleBgClick = this.handleBgClick.bind(this)
  }

  handleBgClick () {
    this.props.dispatchModalsClear()
  }

  handleModalClick (e) {
    e.stopPropagation()
  }

  render () {
    return (
      <div className={css.modalStack}>
        { this.props.stack.length > 0 && (
          <div
            className={css.stackContainer}
            onClick={this.handleBgClick}
            onKeyPress={this.handleBgClick}
            tabIndex={0}
            role='button'
          >
            { this.props.stack.map((modal) => (
              <div
                key={modal.key}
                className={css.modal}
                onClick={this.handleModalClick}
                onKeyPress={this.handleModalClick}
                role='button'
                tabIndex={0}
              >
                <modal.component {...modal.props} />
              </div>
            )) }
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    stack: state.modals.stack,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchModalsClear () {
      dispatch(modalsClear())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalStack)
