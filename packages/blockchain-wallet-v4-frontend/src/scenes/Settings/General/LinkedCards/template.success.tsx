import React, { SyntheticEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { FiatType, BSPaymentTypes } from '@core/types'
import { Box, Button, Text } from 'blockchain-info-components'
import { CARD_TYPES, DEFAULT_CARD_SVG_LOGO } from 'components/Form/CreditCardBox/model'
import { SettingComponent, SettingContainer, SettingSummary } from 'components/Setting'
import { media } from 'services/styles'

import { CardDetails, Child, CustomSettingHeader, RemoveButton } from '../styles'
import { Props as OwnProps, SuccessStateType } from '.'

const CustomSettingContainer = styled(SettingContainer)`
  ${media.atLeastLaptopL`
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  `}
`
const CustomSettingComponent = styled(SettingComponent)`
  margin-top: 36px;
  ${media.tablet`
    margin-top: 8px;
  `}
`
const CardImg = styled.img`
  margin-right: 14px;
  width: 24px;
`

const CardIconWrapper = styled.div`
  margin-right: 14px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`

const Success: React.FC<
  InjectedFormProps<{}, Props & { fiatCurrency?: FiatType }> & Props & { fiatCurrency?: FiatType }
> = (props) => {
  const ccPaymentMethod = props.paymentMethods.methods.find(
    (m) => m.type === BSPaymentTypes.PAYMENT_CARD
  )
  const activeCards = props.cards.filter((card) => card.state === 'ACTIVE')

  return (
    <CustomSettingContainer>
      <SettingSummary>
        <CustomSettingHeader>
          <FormattedMessage id='scenes.settings.linked_cards' defaultMessage='Linked Cards' />
        </CustomSettingHeader>

        {!activeCards.length && (
          <Text size='14px' color='grey600' weight={500}>
            <FormattedMessage
              id='scenes.settings.no_credit_cards'
              defaultMessage='No Credit Cards'
            />
          </Text>
        )}
        {activeCards.map((card) => {
          const cardType = CARD_TYPES.find(
            (cardType) => cardType.type === (card.card ? card.card.type : '')
          )

          if (card.state !== 'ACTIVE') return

          const cardLabel = (card?.card.label && card?.card.label.toLowerCase()) || card?.card.type

          return (
            <Box isMobile={media.mobile} key={card.id} style={{ width: '430px' }}>
              <Child>
                <CardIconWrapper>
                  <CardImg src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO} />
                </CardIconWrapper>
                <CardDetails>
                  <Text size='16px' color='grey800' weight={600} capitalize>
                    {cardLabel.length > 22 ? `${cardLabel.slice(0, 22)}…` : cardLabel}
                  </Text>
                  {ccPaymentMethod && (
                    <Text size='14px' color='grey600' weight={500}>
                      <FormattedMessage
                        id='scenes.settings.card_ending_in'
                        defaultMessage='Card Ending in {cardNumber}'
                        values={{ cardNumber: card.card.number }}
                      />
                    </Text>
                  )}
                </CardDetails>
              </Child>
              <Child>
                <RemoveButton
                  data-e2e='removeCard'
                  nature='light-red'
                  disabled={props.submitting}
                  style={{ marginLeft: '18px', minWidth: 'auto' }}
                  // @ts-ignore
                  onClick={(e: SyntheticEvent) => {
                    e.stopPropagation()
                    props.buySellActions.deleteCard(card.id)
                  }}
                >
                  <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
                </RemoveButton>
              </Child>
            </Box>
          )
        })}
      </SettingSummary>
      <CustomSettingComponent>
        <Button
          nature='primary'
          data-e2e='addCardFromSettings'
          onClick={() => props.handleCreditCardClick()}
        >
          <FormattedMessage id='buttons.add_card' defaultMessage='Add Card' />
        </Button>
      </CustomSettingComponent>
    </CustomSettingContainer>
  )
}

type Props = OwnProps &
  SuccessStateType & {
    handleCreditCardClick: () => void
  }

export default reduxForm<{}, Props>({ form: 'linkedCards' })(Success)
