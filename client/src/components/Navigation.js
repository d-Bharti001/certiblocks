import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Grid, Link, Toolbar, Typography } from '@material-ui/core'
import { useStyles } from '../styles'

function Navigation() {

  const classes = useStyles()

  return (
    <div className={classes.navBar}>
      <AppBar position='fixed'>
        <Toolbar>
          <Grid container alignItems='center' spacing={2}>
            <Grid item className={classes.title} xs={12} sm='auto'>
              <Typography variant='h6'>
                <Link color='inherit' underline='none' component={RouterLink} to='/'>
                  CertiBlocks
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm='auto'>
              <Typography variant='body2'>
                <Link color='inherit' component={RouterLink} to='/dashboard'>
                  Dashboard
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm='auto'>
              <Typography variant='body2'>
                <Link color='inherit' component={RouterLink} to='/certify'>
                  Certify
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm='auto'>
              <Typography variant='body2'>
                <Link color='inherit' component={RouterLink} to='/verify'>
                  Verify certificate
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm='auto'>
              <Typography variant='body2'>
                <Link color='inherit' component={RouterLink} to='/register'>
                  Register new authority
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Navigation
