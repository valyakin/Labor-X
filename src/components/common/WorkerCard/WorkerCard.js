import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'
import { ProfileModel, JobOfferModel, JobModel, JOB_STATE_CREATED, WorkerModel } from 'src/models'
import { Link, Button, Rating, SecurityShield, WorkerState } from 'src/components/common'
import { acceptOffer } from 'src/store'
import css from './WorkerCard.scss'

const dateFormat = 'DD MMM YYYY h:mm A'

class WorkerCard extends React.Component {
  static propTypes = {
    offer: PropTypes.instanceOf(JobOfferModel).isRequired,
    worker: PropTypes.instanceOf(ProfileModel).isRequired,
    workerProfile: PropTypes.instanceOf(WorkerModel).isRequired,
    job: PropTypes.instanceOf(JobModel),
    offerSent: PropTypes.bool,
    acceptOffer: PropTypes.func,
    jobId: PropTypes.number,
  }

  static defaultProps = {
    offerSent: false,
  }

  handleAcceptOffer = () => {
    // eslint-disable-next-line no-console
    console.log('WorkerCard-handleAcceptOffer')
    this.props.acceptOffer()
  }

  handleViewOffer () {
    // eslint-disable-next-line no-console
    console.log('WorkerCard-handleViewOffer')
  }

  handleReviewOffer () {
    // eslint-disable-next-line no-console
    console.log('WorkerCard-handleReviewOffer')
  }

  handleDismissOffer () {
    // eslint-disable-next-line no-console
    console.log('WorkerCard-handleDismissOffer')
  }

  handleSendOffer () {
    // eslint-disable-next-line no-console
    console.log('WorkerCard-handleSendOffer')
  }

  renderFooterOfferSent (offer) {
    const offerAmount = offer.estimate && offer.rate ? offer.estimate.times(offer.rate) : null
    return (
      <div className={css.footerRow}>
        { offerAmount != null && <p className={css.offer}>Offer: LHUS {offerAmount.toFixed(2).toString()} (${(offerAmount.times(30)).toFixed(2).toString()})</p>}
        <p className={css.date}>Sent on {moment(offer.ipfs.appliedDate).format(dateFormat)}</p>
        <div className={css.actions}>
          <Button
            label='VIEW&nbsp;OFFER'
            className={css.buttonBlue}
            mods={Button.MODS.FLAT}
            onClick={this.handleViewOffer}
          />
          <Button
            label='DISMISS&nbsp;OFFER'
            className={css.buttonRed}
            mods={Button.MODS.FLAT}
            onClick={this.handleDismissOffer}
          />
        </div>
      </div>
    )
  }

  renderFooter (offer) {
    const offerAmount = offer.estimate && offer.rate ? offer.estimate.times(offer.rate) : null
    return (
      <div className={css.footerRow}>
        { offerAmount != null && <p className={css.offer}>Offer: LHUS {offerAmount.toFixed(2).toString()} (${(offerAmount.times(30)).toFixed(2).toString()})</p>}
        <p className={css.date}>Applied on {moment(offer.ipfs.appliedDate).format(dateFormat)}</p>
        <div className={css.actions}>
          {
            this.props.job.state === JOB_STATE_CREATED ? (
              <Button
                label='ACCEPT OFFER'
                className={css.buttonBlue}
                mods={Button.MODS.FLAT}
                onClick={this.handleAcceptOffer}
              />
            ) : null
          }
          { offerAmount != null
            ? <Button
              label='REVIEW&nbsp;THE&nbsp;OFFER'
              className={css.buttonBlue}
              mods={Button.MODS.FLAT}
              onClick={this.handleReviewOffer}
            />
            : <Button
              label='SEND&nbsp;AN&nbsp;OFFER'
              className={css.buttonRed}
              mods={Button.MODS.FLAT}
              onClick={this.handleSendOffer}
            />
          }
        </div>
      </div>
    )
  }

  render () {
    const { worker, workerProfile, offer, offerSent } = this.props
    return (
      <div className={cn(css.root, {
        [css.attention]: !offerSent && offer,
      })}
      >
        <div className={css.workerRow}>
          <div className={css.workerName}>
            {worker.ipfs.logo != null && (
              <img className={css.icon} src={worker.ipfs.logo} alt={worker.ipfs.name} />
            )}
            <Link className={css.link} href={`/worker-profile/${worker.id}`}>
              <h4>{worker.ipfs.name}</h4>
              <p>Worker</p>
            </Link>
          </div>
          <div className={css.extraData}>
            <Rating rating={workerProfile.extra.rating} />
            <SecurityShield level={workerProfile.extra.validationLevel} />
            <WorkerState state={workerProfile.extra.state} />
          </div>
        </div>
        { offerSent ? this.renderFooterOfferSent(offer) : this.renderFooter(offer) }
      </div>
    )
  }
}

const mapStateToProps = () => ({
  // TODO @aevalyakin get actual worker
  workerProfile: new WorkerModel({}),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  acceptOffer: () => dispatch(acceptOffer(ownProps.jobId, ownProps.worker.address)),
})

export default connect(mapStateToProps, mapDispatchToProps)(WorkerCard)
