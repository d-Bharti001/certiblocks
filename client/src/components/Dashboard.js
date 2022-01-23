import React, { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, CircularProgress, Container, Grid, IconButton, Link, Paper, TextField, Tooltip, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { NavigateNextRounded } from '@material-ui/icons'
import { useStyles } from '../styles'
import { useBackend, getDateFromTimestamp } from '../contexts/BackendContext'
import MetamaskConnector from './MetamaskConnector'

function Dashboard() {

  const classes = useStyles()
  const { account, getPastCertificates, web3 } = useBackend()

  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [providerAddr, setProviderAddr] = useState('')
  const [providerAddrError, setProviderAddrError] = useState('')
  const [studAddr, setStudAddr] = useState('')
  const [studAddrError, setStudAddrError] = useState('')

  const handleProviderAddressChange = (event) => {
    let acc = event.target.value
    setProviderAddr(acc)
    setProviderAddrError('')
    if (!acc) {
      return
    } else if (!web3.utils.isAddress(acc)) {
      setProviderAddrError('Not an address')
    }
  }

  const handleStudentAddressChange = (event) => {
    let acc = event.target.value
    setStudAddr(acc)
    setStudAddrError('')
    if (!acc) {
      return
    } else if (!web3.utils.isAddress(acc)) {
      setStudAddrError('Not an address')
    }
  }

  const handleSubmit = (providerAddress, studentAddress) => {
    if (
      (providerAddress && !web3.utils.isAddress(providerAddress))
      || (studentAddress && !web3.utils.isAddress(studentAddress))
    ) {
      return
    }
    setLoading(true)
    setError('')
    getPastCertificates(providerAddress, studentAddress).then(result => {
      setCertificates(result)
      setLoading(false)
    }).catch(error => {
      console.error(error.message)
      setError('Something went wrong. Please check console for details.')
      setLoading(false)
    })
  }

  const handleResetFilters = () => {
    setProviderAddr('')
    setProviderAddrError('')
    setStudAddr('')
    setStudAddrError('')
    handleSubmit()
  }

  useEffect(() => {
    if (account)
      handleSubmit()
    // eslint-disable-next-line
  }, [account])

  return (
    <div>
      <Container maxWidth='lg'>
        <Paper variant='outlined' className={classes.paper}>
          <Typography variant='h4' paragraph>
            View issued certificates here
          </Typography>
          <hr className={classes.horizontalLine} />
          {account ?
            <>
              <Container maxWidth='md'>
                <Grid container spacing={2} direction='column'>
                  <Grid item>
                    <Typography variant='body1' color='textSecondary'>
                      Filter according to <em>Issuing Authority address, Student address:</em>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      label='Paste Issuer address'
                      value={providerAddr}
                      error={Boolean(providerAddrError)}
                      helperText={providerAddrError}
                      onChange={handleProviderAddressChange}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      label='Paste Student address'
                      value={studAddr}
                      error={Boolean(studAddrError)}
                      helperText={studAddrError}
                      onChange={handleStudentAddressChange}
                    />
                  </Grid>
                  <Grid container item justifyContent='space-between'>
                    <Grid item>
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={handleResetFilters}
                      >
                        Reset
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant='outlined'
                        color='primary'
                        disabled={Boolean((!providerAddr && !studAddr) || (providerAddrError || studAddrError))}
                        onClick={() => handleSubmit(providerAddr, studAddr)}
                      >
                        Apply filter
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Container>
              <hr className={classes.horizontalLine} />
              <Container maxWidth='md'>
                <Grid container spacing={3}>
                  {loading ?
                    <Grid container item xs justifyContent='center'>
                      <CircularProgress style={{ color: grey[500] }} />
                    </Grid> :
                    error ?
                      <Grid container item xs justifyContent='center'>
                        <Typography variant='subtitle2' color='textSecondary'>
                          {error}
                        </Typography>
                      </Grid> :
                      <>
                        {certificates.map((c, i) => (
                          <Grid item xs={12} sm={6} md={4} key={i}>
                            <Paper elevation={3} className={classes.certificate}>
                              <Typography variant='caption' color='textSecondary' gutterBottom className={classes.longWord}>
                                ID: {c.certId}
                              </Typography>
                              <Typography variant='body2' gutterBottom className={classes.longWord}>
                                Issued to: {c.studAddr}
                              </Typography>
                              <Typography variant='body2' gutterBottom className={classes.longWord}>
                                Issued by: {c.providerAddr}
                              </Typography>
                              <Typography variant='body2' gutterBottom className={classes.longWord}>
                                Course: {c.courseName}
                              </Typography>
                              <Typography variant='caption' color='textSecondary' gutterBottom className={classes.longWord}>
                                Issued on: {getDateFromTimestamp(c.timestamp)} (timestamp: {c.timestamp})
                              </Typography>
                              <Grid container item justifyContent='flex-end'>
                                <Tooltip title='View details'>
                                  <Link component={RouterLink} to={`/verify?id=${c.certId}`} target='_blank'>
                                    <IconButton>
                                      <NavigateNextRounded />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              </Grid>
                            </Paper>
                          </Grid>
                        ))}
                      </>
                  }
                </Grid>
              </Container>
            </> :
            <MetamaskConnector />
          }
        </Paper>
      </Container>
    </div>
  )
}

export default Dashboard
