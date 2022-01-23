import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, CircularProgress, Container, Grid, Paper, TextField, Typography } from '@material-ui/core'
import { CheckCircleOutline } from '@material-ui/icons'
import { useStyles } from '../styles'
import { useBackend, getDateFromTimestamp } from '../contexts/BackendContext'
import MetamaskConnector from './MetamaskConnector'

function Verify() {

  const classes = useStyles()
  const { account, getCertificateInfoById } = useBackend()
  const [searchParams,] = useSearchParams()
  const [certId, setCertId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [certificateInfo, setCertificateInfo] = useState()

  const handleChange = (event) => {
    setCertId(event.target.value)
  }

  const handleSubmit = (id) => {
    setLoading(true)
    setError('')
    setCertificateInfo()
    getCertificateInfoById(id).then(res => {
      setCertificateInfo(res)
      setLoading(false)
    }).catch(error => {
      if (error.message === 'Certificate not issued')
        setError('No certificate issued with this ID.')
      else if (error.message === 'Invalid ID')
        setError('Invalid ID provided.')
      else
        setError('Some error occurred!')
      setLoading(false)
    })
  }

  useEffect(() => {
    let givenId = searchParams.get('id')
    if (account && givenId) {
      setCertId(givenId)
      handleSubmit(givenId)
    }
    // eslint-disable-next-line
  }, [account])

  return (
    <div>
      <Container maxWidth='md'>
        <Paper variant='outlined' className={classes.paper}>
          <Typography variant='h4' paragraph>
            Verify certificates here
          </Typography>
          <hr className={classes.horizontalLine} />
          {account ?
            <Container maxWidth='sm'>
              <Grid container spacing={4} direction='column'>
                <Grid item>
                  <form onSubmit={event => {
                    event.preventDefault()
                    handleSubmit(certId)
                  }}
                  >
                    <Grid container item spacing={2} direction='column'>
                      <Grid item>
                        <TextField
                          fullWidth
                          required
                          label='Enter Certificate ID'
                          value={certId}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid container item justifyContent='center'>
                        <Button
                          type='submit'
                          variant='outlined'
                          color='primary'
                          disabled={loading}
                        >
                          Check
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
                <Grid container item justifyContent='center'>
                  {loading && <CircularProgress size='2rem' />}
                </Grid>
                <Grid container item justifyContent='center'>
                  {error ?
                    <Typography variant='subtitle2' color='textSecondary'>
                      {error}
                    </Typography> :
                    certificateInfo ?
                      <Container maxWidth='sm'>
                        <Paper elevation={3} className={classes.certificate}>
                          <Grid container spacing={2} direction='column'>
                            <Grid container item spacing={1} alignItems='center'>
                              <Grid container item xs={2} justifyContent='center'>
                                <CheckCircleOutline fontSize='large' className={classes.greenIcon} />
                              </Grid>
                              <Grid item xs>
                                <Typography variant='caption' color='textSecondary' className={classes.longWord}>
                                  {`Certificate ID: ${certificateInfo.certificateId}`}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2' className={classes.longWord}>
                                Certificate issued to: {certificateInfo.studentAddr}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Name: {certificateInfo.studentName}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Course name: {certificateInfo.courseName}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2'>
                                Marks obtained: {certificateInfo.marks} out of {certificateInfo.totalMarks}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='body2' className={classes.longWord}>
                                Issued by: {certificateInfo.certProviderAddr}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant='caption' color='textSecondary'>
                                Issued on: {getDateFromTimestamp(certificateInfo.timestamp)} (timestamp: {certificateInfo.timestamp})
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Container> :
                      <></>
                  }
                </Grid>
              </Grid>
            </Container> :
            <MetamaskConnector />
          }
        </Paper>
      </Container>
    </div>
  )
}

export default Verify
