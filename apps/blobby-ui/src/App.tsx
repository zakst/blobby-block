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

import { getByTransactionId } from './services/SearchService'

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

  const searchBySelection = async () => {
    switch (selectedSearchLabel) {
      case searchOptions[0].label:
        await getByTransactionId(enteredSearchTerm)
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

    </Container>
  )
}

export default App;
