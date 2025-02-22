import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import NftHeader from './Header'
import Marketplace from './Marketplace'
import YourCollection from './YourCollection'

const NftPage = styled.div`
  width: 100%;
`

const Nfts: React.FC<Props> = (props) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-collection'>('explore')

  useEffect(() => {
    props.nftsActions.fetchNftCollections({})
  }, [])

  return (
    <NftPage>
      <NftHeader {...props} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'explore' ? <Marketplace {...props} /> : null}
      {activeTab === 'my-collection' ? (
        <YourCollection {...props} setActiveTab={setActiveTab} />
      ) : null}
    </NftPage>
  )
}

const mapStateToProps = (state: RootState) => ({
  assets: selectors.components.nfts.getNftAssets(state),
  collections: selectors.components.nfts.getNftCollections(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse(''),
  formValues: selectors.form.getFormValues('nftMarketplace')(state),
  marketplace: selectors.components.nfts.getMarketplace(state)
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  nftsActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Nfts)
