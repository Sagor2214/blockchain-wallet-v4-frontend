import React, { useCallback, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { NavbarNavItemButton, NavbarNavItemIcon, NavbarNavItemTextHeader } from 'components/Navbar'
import { DropdownMenu, DropdownMenuArrow, DropdownMenuItem } from 'components/Navbar/NavbarDropdown'
import { Destination } from 'layouts/Wallet/components'
import { useOnClickOutside } from 'services/misc'

import { Props } from '.'

const TransactIcon = styled(NavbarNavItemIcon)`
  margin-right: 4px;
`

const FeaturesSmall = (props: Props & { showModal: (modal: 'SEND' | 'REQUEST') => void }) => {
  const ref = useRef(null)
  const [isMenuOpen, toggleIsMenuOpen] = useState(false)
  useOnClickOutside(ref, () => toggleIsMenuOpen(false))

  const closeMenu = useCallback(() => {
    toggleIsMenuOpen(!isMenuOpen)
  }, [])

  return (
    <NavbarNavItemButton data-e2e='featuresSmall' onClick={closeMenu}>
      <TransactIcon persist name='plus-in-circle-filled' size='18px' color='alwaysWhite' />
      <NavbarNavItemTextHeader persist color='alwaysWhite' weight={600}>
        <FormattedMessage id='buttons.transact' defaultMessage='Transact' />
      </NavbarNavItemTextHeader>
      <Icon name={isMenuOpen ? 'chevron-up' : 'chevron-down'} size='24px' color='alwaysWhite' />
      {isMenuOpen && (
        <DropdownMenu ref={ref}>
          <DropdownMenuArrow />
          <DropdownMenuItem
            data-e2e='sendButton'
            disabled={!props.sendAvailable}
            onClick={() => props.showModal('SEND')}
          >
            <Destination>
              <FormattedMessage id='buttons.send' defaultMessage='Send' />
            </Destination>
          </DropdownMenuItem>
          <DropdownMenuItem
            data-e2e='requestButton'
            disabled={!props.requestAvailable}
            onClick={() => props.showModal('REQUEST')}
          >
            <Destination>
              <FormattedMessage id='buttons.request' defaultMessage='Request' />
            </Destination>
          </DropdownMenuItem>
          <DropdownMenuItem
            data-e2e='exchangeLink'
            onClick={() => props.swapActions.showModal({ origin: 'FeaturesTopNav' })}
          >
            <Destination>
              <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
            </Destination>
          </DropdownMenuItem>
          <DropdownMenuItem
            data-e2e='buyAndSellLink'
            onClick={() => props.buySellActions.showModal({ origin: 'SideNav' })}
          >
            <Destination>
              <FormattedMessage id='buttons.buy_sell_crypto' defaultMessage='Buy/Sell Crypto' />
            </Destination>
          </DropdownMenuItem>
          <LinkContainer to='/rewards' activeClassName='active'>
            <DropdownMenuItem data-e2e='interestLink'>
              <Destination>
                <FormattedMessage
                  id='layouts.wallet.menuleft.navigation.earninterest'
                  defaultMessage='Earn Rewards'
                />
              </Destination>
            </DropdownMenuItem>
          </LinkContainer>
          {props.invitations.nfts ? (
            <LinkContainer to='/rewards' activeClassName='active'>
              <DropdownMenuItem data-e2e='interestLink'>
                <Destination>
                  <FormattedMessage
                    id='layouts.wallet.menuleft.navigation.earninterest'
                    defaultMessage='Earn Rewards'
                  />
                </Destination>
              </DropdownMenuItem>
            </LinkContainer>
          ) : null}
        </DropdownMenu>
      )}
    </NavbarNavItemButton>
  )
}

export default FeaturesSmall
