import React, { memo } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

import BSOrderBanner from './BSOrderBanner'
import BuyCrypto from './BuyCrypto'
import CeloEURRewards from './CeloEURRewards'
import CoinRename from './CoinRename'
import ContinueToGold from './ContinueToGold'
import FinishKyc from './FinishKyc'
import KycResubmit from './KycResubmit'
import NewCurrency from './NewCurrency'
import RecurringBuys from './RecurringBuys'
import { getData } from './selectors'
import ServicePriceUnavailable from './ServicePriceUnavailable'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
`

class Banners extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.buySellActions.fetchOrders()
    this.props.buySellActions.fetchSDDEligibility()
    if (this.props.userData.tiers?.current > 0) {
      // TODO move this away from BS
      this.props.buySellActions.fetchLimits(this.props.fiatCurrency)
    }
  }

  render() {
    const { bannerToShow } = this.props.data

    switch (bannerToShow) {
      case 'resubmit':
        return (
          <BannerWrapper>
            <KycResubmit />
          </BannerWrapper>
        )
      case 'finishKyc':
        return (
          <BannerWrapper>
            <FinishKyc />
          </BannerWrapper>
        )
      case 'servicePriceUnavailable':
        return (
          <BannerWrapper>
            <ServicePriceUnavailable />
          </BannerWrapper>
        )
      case 'sbOrder':
        return (
          <BannerWrapper>
            <BSOrderBanner />
          </BannerWrapper>
        )
      case 'coinRename':
        return (
          <BannerWrapper>
            <CoinRename />
          </BannerWrapper>
        )
      case 'newCurrency':
        return (
          <BannerWrapper>
            <NewCurrency />
          </BannerWrapper>
        )
      case 'buyCrypto':
        return (
          <BannerWrapper>
            <BuyCrypto />
          </BannerWrapper>
        )
      case 'continueToGold':
        return (
          <BannerWrapper>
            <ContinueToGold />
          </BannerWrapper>
        )
      case 'celoEURRewards':
        return (
          <BannerWrapper>
            <CeloEURRewards />
          </BannerWrapper>
        )
      case 'recurringBuys':
        return (
          <BannerWrapper>
            <RecurringBuys />
          </BannerWrapper>
        )
      default:
        return null
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD'),
  userData: selectors.modules.profile.getUserData(state).getOrElse({
    tiers: { current: 0 }
  } as UserDataType)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(memo(Banners))
