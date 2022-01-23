import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  navBar: {
    height: 100,
    [theme.breakpoints.down('xs')]: {
      height: 200,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  greenIcon: {
    color: green[500],
  },
  horizontalLine: {
    height: '1px',
    border: '0px',
    borderTop: '1px solid #ccc',
    padding: '0px',
    margin: theme.spacing(2, 'auto', 4),
  },
  paper: {
    padding: theme.spacing(4, 2),
    margin: theme.spacing(0, 'auto', 10),
  },
  walletConnector: {
    margin: theme.spacing(16, 'auto', 4),
  },
  iconBeforeText: {
    marginRight: theme.spacing(1),
  },
  longWord: {
    overflowWrap: 'anywhere',
  },
  certificate: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
}), { index: 1 })
