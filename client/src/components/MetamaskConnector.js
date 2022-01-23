import React from 'react'
import { Button, Container, Typography } from '@material-ui/core'
import { useStyles } from '../styles'
import { useBackend } from '../contexts/BackendContext'

function MetamaskConnector() {

  const classes = useStyles()
  const { connectMetamask, loading, error, account } = useBackend()

  const handleClick = () => {
    if (!account) {
      connectMetamask()
    }
  }

  return (
    <div>
      <Container maxWidth='xs' className={classes.walletConnector}>
        {error &&
          <Typography variant='subtitle2' color='error' gutterBottom align='center'>
            {error}
          </Typography>
        }
        <Button
          fullWidth
          color='primary'
          variant='outlined'
          disabled={loading}
          onClick={handleClick}
        >
          {account ? 'Connected' : 'Connect MetaMask'}
        </Button>
      </Container>
    </div>
  )
}

export default MetamaskConnector
