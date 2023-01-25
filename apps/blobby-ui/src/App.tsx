import React, { useState } from 'react'
import './App.css'
import {
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField
} from '@material-ui/core'

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

  const [selectedSearchLabel, setSelectedSearchLabel] = useState('')

  return (
    <Container maxWidth="xl">
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
          <TextField fullWidth id="search-term" label={"Search Term"} variant="outlined" />
        </Grid>
      </Grid>

    </Container>
  )
}

export default App;
