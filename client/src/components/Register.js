import React, { useState } from 'react'
import { Button, CircularProgress, Container, Grid, Paper, TextField, Typography } from '@material-ui/core'
import { useStyles } from '../styles'
import { useBackend } from '../contexts/BackendContext'
import MetamaskConnector from './MetamaskConnector'

function Register() {

  const classes = useStyles()
  const { account, checkIfRegistered, registerNewAuthority, web3 } = useBackend()
  const [inputAcc, setInputAcc] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState({ text: '', color: '' })

  const handleChange = (event) => {
    let acc = event.target.value
    setInputAcc(acc)
    setMsg({ text: '', color: '' })
    if (!acc) {
      return
    }
    if (web3.utils.isAddress(acc)) {
      setLoading(true)
      checkIfRegistered(acc).then(result => {
        setLoading(false)
        if (result === true) {
          setMsg({ text: 'Account already registered', color: 'textSecondary' })
        } else if (result === false) {
          setMsg({ text: 'Account can be registered (by owner only)', color: 'textSecondary' })
        }
      }).catch(error => {
        setLoading(false)
        setMsg({ text: 'Something went wrong!', color: 'error' })
      })
    } else {
      setMsg({ text: 'Not an address', color: 'textSecondary' })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!web3.utils.isAddress(inputAcc))
      return
    setLoading(true)
    setMsg({ text: 'Please wait while the transaction is being processed', color: 'textSecondary' })
    registerNewAuthority(inputAcc).then(_ => {
      setLoading(false)
      setMsg({ text: 'Account registered successfully', color: 'textSecondary' })
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
            Register new authority
          </Typography>
          <Typography variant='body2' paragraph>
            Register new accounts as authorities. They'll be able to generate certificates.
          </Typography>
          <Typography variant='body2' paragraph>
            Only the owner account can carry out this action. Otherwise the transaction will be rejected.
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
                      label='Paste the address'
                      value={inputAcc}
                      onChange={handleChange}
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
                  <Grid item>
                    <Button
                      fullWidth
                      type='submit'
                      variant='outlined'
                      color='primary'
                      disabled={loading}
                    >
                      Register account
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

export default Register
