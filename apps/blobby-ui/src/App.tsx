import React, { useState } from 'react'
import './App.css'
import {
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  TextField, Typography
} from '@material-ui/core'

import { getByBlockHash, getByNodeAddress, getByTransactionId } from './services/SearchService'
import { SEARCH_OPTION_NOT_SUPPORTED } from './Constants'
import { Label } from '@material-ui/icons'

function App() {
  const searchOptions = [
    {
      value: 'transaction_id',
      label: 'Transaction Id'
    },
    {
      value: 'block_hash',
      label: 'Block Hash'
    },
    {
      value: 'address',
      label: 'Address'
    }
  ]
  const [selectedSearchLabel, setSelectedSearchLabel] = useState(searchOptions[0].label)
  const [enteredSearchTerm, setEnteredSearchTerm] = useState('')
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: 'Nothing here'
  })

  const searchBySelection = async () => {
    switch (selectedSearchLabel) {
      case searchOptions[0].label:
        await getByTransactionId(enteredSearchTerm)
        break
      case searchOptions[1].label:
        await getByBlockHash(enteredSearchTerm)
        break
      case searchOptions[2].label:
        await getByNodeAddress(enteredSearchTerm)
        break
      default:
        setSnackBar({
          open: true,
          message: SEARCH_OPTION_NOT_SUPPORTED
        })
    }
  }

  const search = async (event: { key: string; preventDefault: () => void }) => {
    if (event.key === 'Enter' && enteredSearchTerm.length > 5) {
      await searchBySelection()
      event.preventDefault()
    }
  }

  return (
    <Container maxWidth="xl">
      <Snackbar
        open={snackBar.open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        autoHideDuration={6000}
        message={snackBar.message}
      />
      <Grid container md={12}
            direction="row"
            justifyContent="space-evenly">
        <Grid md={8}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center">
          <FormControl margin={"normal"}>
            <FormLabel id="search-by">Search By {selectedSearchLabel}</FormLabel>
            <RadioGroup
              onChange={(event, value) => {
                const searchFor = searchOptions.find(option => option.value === value)
                setSelectedSearchLabel(searchFor!.label)
              }}
              row
              aria-labelledby="search-by"
              defaultValue="transaction_id"
              name="search-by-group"
            >
              {
                searchOptions.map(option => (
                  <FormControlLabel
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))
              }
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid md={8}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center">
          <TextField
            onKeyDown={search}
            fullWidth
            autoFocus
            id="search-term"
            label={"Search Term"}
            variant="outlined"
            onChange={(event) => {setEnteredSearchTerm(event.target.value)}}
          />
        </Grid>
      </Grid>
      <Grid container md={12}
            direction="row"
            justifyContent="space-evenly">
        <Grid md={3}>
          <Card>
            <CardContent>
              <Typography color="primary" variant="overline">
                Transaction Id Result
              </Typography>
              <Grid direction="row" container md={12} justifyContent="space-between">
                <Typography color="textSecondary">
                  Sender
                </Typography>
                <Typography color="secondary">
                   3343434343
                </Typography>
              </Grid>
              <Grid direction="row" container md={12} justifyContent="space-between">
                <Typography color="textSecondary">
                  Receiver
                </Typography>
                <Typography color="secondary">
                  3343434343
                </Typography>
              </Grid>
              <Grid direction="row" container md={12} justifyContent="space-between">
                <Typography color="textSecondary">
                  Amount
                </Typography>
                <Typography color="secondary">
                  3343434343
                </Typography>
              </Grid>
              <Grid direction="row" container md={12} justifyContent="space-between">
                <Typography variant="subtitle2">
                  TransactionId
                </Typography>
                <Typography variant="subtitle2">
                  3343434343
                </Typography>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Container>
  )
}

export default App;
