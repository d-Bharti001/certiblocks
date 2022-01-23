import React, { useRef, useState } from 'react'
import { Button, CircularProgress, Container, Grid, MenuItem, Paper, TextField, Typography } from '@material-ui/core'
import { useStyles } from '../styles'
import { useBackend, courses } from '../contexts/BackendContext'
import MetamaskConnector from './MetamaskConnector'

function Certify() {

  const classes = useStyles()
  const { account, certifyStudent } = useBackend()

  const studAddr = useRef()
  const studName = useRef()
  const [course, setCourse] = useState('')
  const marks = useRef()
  const totMarks = useRef()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', color: '' })
  const [certificateId, setCertificateId] = useState('')

  const handleCourseChange = (event) => {
    setCourse(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)
    setCertificateId('')
    setMsg({ text: 'Please wait while the transaction is being processed', color: 'textSecondary' })
    certifyStudent(
      studAddr.current.value,
      marks.current.value,
      totMarks.current.value,
      course,
      studName.current.value,
    ).then(result => {
      setLoading(false)
      setMsg({ text: 'Certificate successfully generated', color: 'textSecondary' })
      setCertificateId(result)
    }).catch(error => {
      console.error(error.message)
      setLoading(false)
      setMsg({ text: 'Something went wrong. Please check console for details.', color: 'error' })
    })
  }

  return (
    <div>
      <Container maxWidth='md'>
        <Paper variant='outlined' className={classes.paper}>
          <Typography variant='h4' paragraph>
            Certify students
          </Typography>
          <Typography variant='body2' paragraph>
            Only a registered account can generate a certificate. Otherwise the transaction will be rejected.
          </Typography>
          <hr className={classes.horizontalLine} />
          {account &&
            <Typography variant='body2' paragraph className={classes.longWord}>
              {`Your account: ${account}`}
            </Typography>
          }
          {account ?
            <Container maxWidth='xs'>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction='column'>
                  <Grid item>
                    <TextField
                      fullWidth
                      required
                      label='Student account address'
                      inputRef={studAddr}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      required
                      label='Student name'
                      inputRef={studName}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      required
                      label='Course'
                      select
                      value={course}
                      onChange={handleCourseChange}
                    >
                      {courses.map((c, i) => (
                        <MenuItem key={i} value={c}>{c}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      required
                      label='Marks obtained'
                      type='number'
                      inputRef={marks}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      required
                      label='Total marks'
                      type='number'
                      inputRef={totMarks}
                    />
                  </Grid>
                  <Grid container item spacing={1} alignItems='center'>
                    {loading &&
                      <Grid item xs={1}>
                        <CircularProgress size='1.2rem' />
                      </Grid>
                    }
                    {msg.text &&
                      <Grid item xs='auto'>
                        <Typography variant='subtitle2' color={msg.color}>
                          {msg.text}
                        </Typography>
                      </Grid>
                    }
                  </Grid>
                  {certificateId &&
                    <Grid item>
                      <Typography variant='caption' color='textSecondary' className={classes.longWord}>
                        {`ID: ${certificateId}`}
                      </Typography>
                    </Grid>
                  }
                  <Grid item>
                    <Button
                      fullWidth
                      type='submit'
                      variant='outlined'
                      color='primary'
                      disabled={loading}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Container> :
            <MetamaskConnector />
          }
        </Paper>
      </Container>
    </div>
  )
}

export default Certify
