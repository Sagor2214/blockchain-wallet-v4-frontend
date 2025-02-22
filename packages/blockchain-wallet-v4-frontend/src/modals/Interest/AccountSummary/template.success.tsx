import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import { pathOr } from 'ramda'

import { Exchange } from '@core'
import { formatFiat } from '@core/exchange/utils'
import { CoinType, FiatType } from '@core/types'
import { Button, Icon, Link, Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { InterestStepMetadata } from 'data/types'

import { DataSuccessStateType, LinkDispatchPropsType, OwnProps } from '.'
import {
  Bottom,
  ButtonContainer,
  Container,
  DetailsItemContainer,
  DetailsWrapper,
  LineVector,
  LineVectorDetails,
  LinkWrapper,
  Row,
  StatusIconWrapper,
  StatusSupplyWrapper,
  StatusWrapper,
  Top,
  TopText,
  Wrapper
} from './model'

const AccountSummary: React.FC<Props> = (props) => {
  const {
    accountBalances,
    coin,
    flagEDDInterestFileUpload,
    handleClose,
    handleDepositClick,
    handleBSClick,
    interestActions,
    interestLimits,
    interestRate,
    interestUploadDocumentActions,
    showSupply,
    stepMetadata,
    walletCurrency
  } = props

  const { coinfig } = window.coins[coin]
  const account = accountBalances && accountBalances[coin]
  const currencySymbol = Exchange.getSymbol(walletCurrency) as string

  const lockupPeriod = pathOr(1, [coin, 'lockUpDuration'], interestLimits) / 86400
  const accountBalanceBase = account && account.balance
  const interestBalanceBase = account && account.totalInterest
  const pendingInterestBase = account && account.pendingInterest

  const availToWithdraw = account && parseInt(account.balance, 10) - parseInt(account.locked, 10)

  const accountBalanceStandard = convertBaseToStandard(coin, accountBalanceBase)
  const interestBalanceStandard = convertBaseToStandard(coin, interestBalanceBase)
  const pendingInterestStandard = convertBaseToStandard(coin, pendingInterestBase)

  return (
    <Wrapper>
      <Top>
        <TopText color='grey800' size='20px' weight={600}>
          <Row>
            <Icon name={coin} color={coin} size='24px' style={{ marginRight: '16px' }} />
            <FormattedMessage
              id='modals.interest.detailstitle'
              defaultMessage='{displayName} Rewards Account'
              values={{ displayName: coinfig.name }}
            />
          </Row>
          <Icon
            onClick={handleClose}
            cursor
            name='close'
            size='20px'
            color='grey600'
            data-e2e='closeInterest'
          />
        </TopText>
        {!showSupply && (
          <>
            <Row>
              <Container>
                <Text color='grey600' size='14px' weight={500} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='modals.interest.balance'
                    defaultMessage='Your {coin} Balance'
                    values={{ coin: coinfig.name }}
                  />
                </Text>
                {account ? (
                  <>
                    <Text color='grey800' size='18px' weight={600}>
                      {accountBalanceStandard} {coinfig.displaySymbol}
                    </Text>
                    <FiatDisplay
                      color='grey600'
                      size='14px'
                      weight={500}
                      coin={coin}
                      style={{ marginTop: '5px' }}
                    >
                      {account.balance}
                    </FiatDisplay>
                  </>
                ) : (
                  <Text color='grey800' size='18px' weight={600}>
                    0 {coinfig.displaySymbol}
                  </Text>
                )}
              </Container>
              <Container>
                <Text color='grey600' size='14px' weight={500} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='modals.interest.totalearned'
                    defaultMessage='Total Rewards Earned'
                  />
                </Text>
                {account ? (
                  <>
                    <Text color='grey800' size='18px' weight={600}>
                      {interestBalanceStandard} {coinfig.displaySymbol}
                    </Text>
                    <FiatDisplay
                      color='grey600'
                      size='14px'
                      weight={500}
                      coin={coin}
                      style={{ marginTop: '5px' }}
                    >
                      {account.totalInterest}
                    </FiatDisplay>
                  </>
                ) : (
                  <Text color='grey800' size='18px' weight={600}>
                    0 {coinfig.displaySymbol}
                  </Text>
                )}
              </Container>
            </Row>
            <LineVector />
          </>
        )}
        {stepMetadata && stepMetadata.depositSuccess && (
          <>
            <StatusWrapper>
              <StatusIconWrapper color={showSupply ? 'orange000' : coin}>
                <Icon color={showSupply ? 'orange600' : 'white'} name='timer' size='24px' />
              </StatusIconWrapper>
              <Text data-e2e='waitingConfirmation' color='grey600' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.deposit.success.confirmtransfer'
                  defaultMessage='Waiting on your transfer to be confirmed by the network. Once it has a confirmation and our team has reviewed it, it will be displayed in Rewards Account history. No action is required at this time.'
                />
              </Text>
            </StatusWrapper>
            {!showSupply && (
              <StatusWrapper>
                <StatusIconWrapper color='grey000'>
                  <Icon color='grey600' name='check' size='14px' />
                </StatusIconWrapper>
                <Text color='grey600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.interest.deposit.transferclears'
                    defaultMessage='Once the transfer clears, your balance will update and you’ll start earning rewards.'
                  />
                </Text>
              </StatusWrapper>
            )}
          </>
        )}
        {stepMetadata && stepMetadata.withdrawSuccess && (
          <StatusWrapper>
            <StatusIconWrapper color={showSupply ? 'white' : coin}>
              <Icon color={showSupply ? 'orange600' : 'white'} name='timer' size='24px' />
            </StatusIconWrapper>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.withdrawal.success'
                defaultMessage='We are waiting on your withdrawal to be confirmed by the network and our team.'
              />
            </Text>
          </StatusWrapper>
        )}
        {showSupply &&
          stepMetadata &&
          (stepMetadata.withdrawSuccess || stepMetadata.depositSuccess) && (
            <StatusSupplyWrapper className={flagEDDInterestFileUpload ? 'new' : 'old'}>
              <Text color='grey900' size='16px' weight={600}>
                <FormattedMessage
                  id='modals.interest.withdrawal.supply_information_title'
                  defaultMessage='More Info Needed'
                />
              </Text>
              <Text color='grey600' size='12px' weight={500} style={{ marginTop: '16px' }}>
                {stepMetadata.withdrawSuccess ? (
                  flagEDDInterestFileUpload ? (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_1_new'
                      defaultMessage='Your recent withdrawal of {amount} requires further verification for legal and compliance reasons.'
                      values={{
                        amount: `${currencySymbol}${formatFiat(stepMetadata.withdrawalAmount)}`
                      }}
                    />
                  ) : (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_1'
                      defaultMessage="You've requested a withdrawal for an amount that requires further verification for legal and compliance reasons."
                    />
                  )
                ) : (
                  <FormattedMessage
                    id='modals.interest.deposit.supply_information_description_1'
                    defaultMessage="You've transferred an amount that requires further verification for legal and compliance reasons."
                  />
                )}
              </Text>
              <Text color='grey600' size='12px' weight={500} style={{ marginTop: '16px' }}>
                {stepMetadata.withdrawSuccess ? (
                  flagEDDInterestFileUpload ? (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_2_new'
                      defaultMessage='Please submit the additional information so we can start processing your withdrawal.'
                    />
                  ) : (
                    <FormattedMessage
                      id='modals.interest.withdrawal.supply_information_description_2'
                      defaultMessage="You've requested a withdrawal for an amount that requires further verification for legal and compliance reasons."
                    />
                  )
                ) : (
                  <FormattedMessage
                    id='modals.interest.deposit.supply_information_description_2'
                    defaultMessage='Your funds are safe with us and have started accruing rewards already. To avoid delays when you decide to withdraw your funds, submit your information now.'
                  />
                )}
              </Text>

              <LinkWrapper>
                {flagEDDInterestFileUpload ? (
                  <Button
                    data-e2e='earnInterestSupplyMoreInformation'
                    fullwidth
                    nature='primary'
                    onClick={() => {
                      interestUploadDocumentActions.showModal({
                        origin: 'InterestUploadDocument'
                      })
                    }}
                  >
                    <FormattedMessage
                      id='scenes.interest.submit_information'
                      defaultMessage='Submit Information'
                    />
                  </Button>
                ) : (
                  <Link
                    href='https://share.hsforms.com/1DS4i94fURdutr8OXYOxfrg2qt44'
                    style={{ width: '100%' }}
                    target='_blank'
                  >
                    <Button
                      data-e2e='earnInterestSupplyMoreInformation'
                      fullwidth
                      nature='primary'
                      onClick={() => {
                        interestActions.handleWithdrawalSupplyInformation({
                          origin: 'SavingsConfirmation'
                        })
                      }}
                    >
                      <FormattedMessage
                        id='scenes.interest.submit_information'
                        defaultMessage='Submit Information'
                      />
                    </Button>
                  </Link>
                )}
              </LinkWrapper>
            </StatusSupplyWrapper>
          )}
        {stepMetadata && stepMetadata.error && (
          <StatusWrapper>
            <StatusIconWrapper color='red000'>
              <Icon color='red600' name='forbidden' size='24px' />
            </StatusIconWrapper>
            <div>
              <Text color='red600' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.interest.deposit.failure'
                  defaultMessage='Something went wrong. Please try again later or contact support if the issue persists.'
                />
              </Text>
              <Text color='red600' size='14px' style={{ marginTop: '8px' }} weight={500}>
                <FormattedMessage
                  id='modals.interest.deposit.failurereason'
                  defaultMessage='Error: {error}'
                  values={{ error: stepMetadata.error }}
                />
              </Text>
            </div>
          </StatusWrapper>
        )}
        {!showSupply && (
          <ButtonContainer>
            <Button
              data-e2e='interestDeposit'
              height='48px'
              nature='primary'
              onClick={handleDepositClick}
              width='192px'
            >
              <Text weight={600} color='white'>
                <FormattedMessage id='buttons.transfer' defaultMessage='Transfer' />
              </Text>
            </Button>
            <Button
              data-e2e='interestDeposit'
              height='48px'
              nature='empty'
              onClick={() => handleBSClick(coin)}
              width='192px'
            >
              <Text size='16px' weight={600} color='blue600'>
                <FormattedMessage
                  id='buttons.buy_coin'
                  defaultMessage='Buy {displayName}'
                  values={{ displayName: coinfig.displaySymbol }}
                />
              </Text>
            </Button>
          </ButtonContainer>
        )}
        <DetailsWrapper>
          <Text color='grey800' weight={600} style={{ marginBottom: '6px' }}>
            <FormattedMessage id='modals.interest.summary' defaultMessage='Summary' />
          </Text>
          <LineVectorDetails />
          {stepMetadata && (stepMetadata.depositSuccess || stepMetadata.withdrawSuccess) && (
            <>
              <DetailsItemContainer>
                <Text color='grey600' size='14px' weight={500}>
                  <FormattedMessage id='modals.interest.status' defaultMessage='Status' />
                </Text>
                <Text data-e2e='statusText' color='orange600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.interest.statuspending'
                    defaultMessage='Pending {action}'
                    values={{
                      action: stepMetadata.withdrawSuccess ? 'Withdrawal' : 'Transfer'
                    }}
                  />
                </Text>
              </DetailsItemContainer>
              <LineVectorDetails />
            </>
          )}
          <DetailsItemContainer>
            <Text data-e2e='nextPayment' color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.next'
                defaultMessage='Next rewards payment'
              />
            </Text>
            {account ? (
              <Text color='grey600' size='14px' weight={500}>
                {parseInt(account.balance, 10) > 0 || (stepMetadata && stepMetadata.depositSuccess)
                  ? moment().add(1, 'month').startOf('month').format('MMMM D, YYYY')
                  : '---'}
              </Text>
            ) : (
              <Text color='grey600' size='14px' weight={500}>
                --
              </Text>
            )}
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.accrued'
                defaultMessage='Accrued rewards this month'
              />
              <TooltipHost id='modals.interest.summary.accrued.tooltip'>
                <TooltipIcon name='info' size='12px' />
              </TooltipHost>
            </Text>
            {account ? (
              <Text color='grey600' size='14px' weight={500}>
                {pendingInterestStandard} {coinfig.displaySymbol}
              </Text>
            ) : (
              <Text color='grey600' size='14px' weight={500}>
                --
              </Text>
            )}
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage
                id='modals.interest.summary.hold'
                defaultMessage='Initial hold period'
              />
              <TooltipHost id='modals.interest.summary.lock.tooltip'>
                <TooltipIcon name='info' size='12px' />
              </TooltipHost>
            </Text>
            <Text data-e2e='holdPeriod' color='grey600' size='14px' weight={500}>
              {lockupPeriod === 1 ? (
                <FormattedMessage
                  id='modals.interest.summary.lockup.one'
                  defaultMessage='1 Day'
                  values={{ lockupPeriod }}
                />
              ) : (
                <FormattedMessage
                  id='modals.interest.summary.lockup'
                  defaultMessage='{lockupPeriod} Days'
                  values={{ lockupPeriod }}
                />
              )}
            </Text>
          </DetailsItemContainer>
          <LineVectorDetails />
          <DetailsItemContainer>
            <Text color='grey600' size='14px' weight={500}>
              <FormattedMessage id='modals.interest.summary.rate' defaultMessage='Rewards rate' />
              <TooltipHost id='modals.interest.summary.moreinterestdetails.tooltip'>
                <TooltipIcon name='info' size='12px' />
              </TooltipHost>
            </Text>
            <Text data-e2e='interestRate' color='grey600' size='14px' weight={500}>
              {interestRate[coin]}%
            </Text>
          </DetailsItemContainer>
        </DetailsWrapper>
      </Top>
      {!showSupply && (
        <Bottom>
          <ButtonContainer>
            <Button
              disabled={!account || !availToWithdraw}
              data-e2e='interestWithdraw'
              fullwidth
              height='48px'
              nature='grey800'
              onClick={() => interestActions.showInterestModal({ coin, step: 'WITHDRAWAL' })}
            >
              <Text color='white' size='16px' weight={600}>
                <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />
              </Text>
            </Button>
          </ButtonContainer>
        </Bottom>
      )}
    </Wrapper>
  )
}

type ParentProps = {
  coin: CoinType
  handleDepositClick: () => void
  handleBSClick: (string) => void
  stepMetadata: InterestStepMetadata
  walletCurrency: FiatType
}

export type Props = OwnProps & LinkDispatchPropsType & DataSuccessStateType & ParentProps
export default AccountSummary
