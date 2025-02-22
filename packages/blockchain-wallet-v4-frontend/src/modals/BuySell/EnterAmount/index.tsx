import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import {
  CoinType,
  ExtractSuccess,
  FiatType,
  RemoteDataType,
  BSOrderActionType,
  BSOrderType,
  BSPairType,
  BSPaymentMethodType
} from '@core/types'
import { FlyoutOopsError } from 'components/Flyout'
import { actions, selectors } from 'data'
import { DEFAULT_BS_METHODS } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'

import Loading from '../template.loading'
import getData from './selectors'
import Success from './template.success'

class EnterAmount extends PureComponent<Props> {
  componentDidMount() {
    if (this.props.fiatCurrency && !Remote.Success.is(this.props.data)) {
      this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
      this.props.buySellActions.fetchFiatEligible(this.props.fiatCurrency)
      this.props.buySellActions.fetchPairs({
        coin: this.props.cryptoCurrency,
        currency: this.props.fiatCurrency
      })
      this.props.brokerageActions.fetchBankTransferAccounts()
      this.props.buySellActions.fetchCards(false)
      this.props.buySellActions.fetchSDDEligibility()
    }

    // data was successful but paymentMethods was DEFAULT_BS_METHODS
    if (this.props.fiatCurrency && Remote.Success.is(this.props.data)) {
      if (equals(this.props.data.data.paymentMethods, DEFAULT_BS_METHODS)) {
        this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
      }
    }
  }

  errorCallback() {
    this.props.buySellActions.setStep({
      fiatCurrency: this.props.fiatCurrency || 'USD',
      step: 'CRYPTO_SELECTION'
    })
  }

  render() {
    return this.props.data.cata({
      Failure: () => (
        <FlyoutOopsError
          action='retry'
          data-e2e='sbTryCurrencySelectionAgain'
          handler={this.errorCallback}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...val} {...this.props} />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  cryptoCurrency: selectors.components.buySell.getCryptoCurrency(state) || 'BTC',
  data: getData(state),
  fiatCurrency: selectors.components.buySell.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method?: BSPaymentMethodType
  order?: BSOrderType
  orderType: BSOrderActionType
  pair: BSPairType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type LinkStatePropsType = {
  cryptoCurrency: CoinType
  data: RemoteDataType<string, SuccessStateType>
  fiatCurrency: undefined | FiatType
}
export type FailurePropsType = {
  buySellActions: typeof actions.components.buySell
  fiatCurrency: undefined | FiatType
}

export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(EnterAmount)
