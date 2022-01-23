import React from 'react'
import { Container, Link, Paper, Typography } from '@material-ui/core'
import { useStyles } from '../styles'
import MetamaskConnector from './MetamaskConnector'

function Homepage() {

  const classes = useStyles()

  return (
    <div>
      <Container maxWidth='md'>
        <Paper variant='outlined' className={classes.paper}>
          <Typography variant='h3'>
            CertiBlocks
          </Typography>
          <hr className={classes.horizontalLine} />
          <Typography variant='body2' paragraph>
            A blockchain based certification add-on for educational platforms
          </Typography>
          <Typography variant='h6'>
            Navigation guide
          </Typography>
          <Typography variant='body2' gutterBottom>
            <strong>Dashboard</strong>: See the issued certificates here
          </Typography>
          <Typography variant='body2' gutterBottom>
            <strong>Certify</strong>: Here a registered authority can certify students
          </Typography>
          <Typography variant='body2' gutterBottom>
            <strong>Verify certificate</strong>: Verify the certificates on the basis of Certification IDs
          </Typography>
          <Typography variant='body2' paragraph>
            <strong>Register new authority</strong>: Here the owner can register new accounts as authorities for providing certificates
          </Typography>
          <Typography variant='body2' paragraph>
            Powered by <Link href='https://ethereum.org/en/developers/docs/smart-contracts/' target='_blank'>Ethereum Smart Contract</Link>
          </Typography>
          <Typography variant='body2' paragraph>
            For more information: <Link href='https://github.com/d-Bharti001/certiblocks' target='_blank'>Visit GitHub repo</Link>
          </Typography>
          <MetamaskConnector />
        </Paper>
      </Container>
    </div>
  )
}

export default Homepage
