import Card from '@material-ui/core/Card'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Item from './components/Item'

import Paragraph from 'src/components/layout/Paragraph'
import { activeNftAssetsListSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { safeSelector } from 'src/logic/safe/store/selectors'
import { fontColor, lg, screenSm, screenXs } from 'src/theme/variables'
import { NFTToken } from 'src/logic/collectibles/sources/OpenSea'
import { SAFE_NAVIGATION_EVENT, useAnalytics } from 'src/utils/googleAnalytics'

const useStyles = makeStyles(
  createStyles({
    cardInner: {
      boxSizing: 'border-box',
      maxWidth: '100%',
      padding: '52px 54px',
    },
    cardOuter: {
      boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
    },
    gridRow: {
      boxSizing: 'border-box',
      columnGap: '30px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      marginBottom: '45px',
      maxWidth: '100%',
      rowGap: '45px',

      '&:last-child': {
        marginBottom: '0',
      },

      [`@media (min-width: ${screenXs}px)`]: {
        gridTemplateColumns: '1fr 1fr',
      },

      [`@media (min-width: ${screenSm}px)`]: {
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
      },
    },
    title: {
      alignItems: 'center',
      display: 'flex',
      margin: '0 0 18px',
    },
    titleImg: {
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      borderRadius: '50%',
      height: '45px',
      margin: '0 10px 0 0',
      width: '45px',
    },
    titleText: {
      color: fontColor,
      fontSize: '18px',
      fontWeight: 'normal',
      lineHeight: '1.2',
      margin: '0',
    },
    titleFiller: {
      backgroundColor: '#e8e7e6',
      flexGrow: 1,
      height: '2px',
      marginLeft: '40px',
    },
    noData: {
      fontSize: lg,
      textAlign: 'center',
    },
  }),
)

const Collectibles = (): React.ReactElement => {
  const classes = useStyles()
  const [selectedToken, setSelectedToken] = React.useState<NFTToken>()
  const [sendNFTsModalOpen, setSendNFTsModalOpen] = React.useState(false)
  const { ethBalance } = useSelector(safeSelector) || {}
  const nftTokens = useSelector(nftTokensSelector)
  const activeAssetsList = useSelector(activeNftAssetsListSelector)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Collectibles' })
  }, [trackEvent])

  const handleItemSend = (nftToken: NFTToken) => {
    setSelectedToken(nftToken)
    setSendNFTsModalOpen(true)
  }

  return (
    <Card className={classes.cardOuter}>
      <div className={classes.cardInner}>
        {activeAssetsList.length ? (
          activeAssetsList.map((nftAsset) => {
            return (
              <React.Fragment key={nftAsset.slug}>
                <div className={classes.title}>
                  <div className={classes.titleImg} style={{ backgroundImage: `url(${nftAsset.image || ''})` }} />
                  <h2 className={classes.titleText}>{nftAsset.name}</h2>
                  <div className={classes.titleFiller} />
                </div>
                <div className={classes.gridRow}>
                  {nftTokens
                    .filter(({ assetAddress }) => nftAsset.address === assetAddress)
                    .map((nftToken) => (
                      <Item
                        data={nftToken}
                        key={`${nftAsset.slug}_${nftToken.tokenId}`}
                        onSend={() => handleItemSend(nftToken)}
                      />
                    ))}
                </div>
              </React.Fragment>
            )
          })
        ) : (
          <Paragraph className={classes.noData}>No collectibles available</Paragraph>
        )}
      </div>
      <SendModal
        activeScreenType="sendCollectible"
        ethBalance={ethBalance}
        isOpen={sendNFTsModalOpen}
        onClose={() => setSendNFTsModalOpen(false)}
        selectedToken={selectedToken}
      />
    </Card>
  )
}

export default Collectibles
