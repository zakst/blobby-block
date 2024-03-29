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
  Snackbar,
  TextField,
} from '@material-ui/core'

import { getByBlockHash, getByNodeAddress, getByTransactionId } from './services/SearchService'
import { SEARCH_OPTION_NOT_SUPPORTED, SEARCH_TYPES } from './Constants'
import TransactionSearchResult from './components/TransactionSearchResult'
import TransactionResponseDto from './dtos/transactionResponse.dto'
import BlockResponseDto from './dtos/blockResponse.dto'
import AddressTransactionsDto from './dtos/addressTransactions.dto'
import BlockhashSearchResult from './components/BlockhashSearchResult'
import AddressSearchResult from './components/AddressSearchResult'

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
  const [searchType, setSearchType] = useState('')
  const [transactionResult, setTransactionResult] = useState(new TransactionResponseDto())
  const [blockhashResult, setBlockhashResult] = useState(new BlockResponseDto())
  const [nodeAddressResult, setNodeAddressResult] = useState(new AddressTransactionsDto())
  const [enteredSearchTerm, setEnteredSearchTerm] = useState('')
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: 'Nothing here'
  })

  const searchBySelection = async () => {
    switch (selectedSearchLabel) {
      case searchOptions[0].label:
        const transactionResponse = await getByTransactionId(enteredSearchTerm)
        setTransactionResult(transactionResponse)
        setSearchType(SEARCH_TYPES.TRANSACTION_ID)
        break
      case searchOptions[1].label:
        const blockResponse = await getByBlockHash(enteredSearchTerm)
        setBlockhashResult(blockResponse)
        setSearchType(SEARCH_TYPES.BLOCK_HASH)
        break
      case searchOptions[2].label:
        const addressTransactions = await getByNodeAddress(enteredSearchTerm)
        setNodeAddressResult(addressTransactions)
        setSearchType(SEARCH_TYPES.ADDRESS)
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
                    control={<Radio/>}
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
            onChange={(event) => {
              setEnteredSearchTerm(event.target.value)
            }}
          />
        </Grid>
      </Grid>
      <Grid container md={12}
            direction="row"
            justifyContent="space-evenly">
        {searchType === SEARCH_TYPES.TRANSACTION_ID && (
          <Grid md={3}>
            <TransactionSearchResult
              sender={transactionResult.transaction.sender}
              receiver={transactionResult.transaction.receiver}
              amount={transactionResult.transaction.amount}
              transactionId={transactionResult.transaction.transactionId}/>
          </Grid>
        )}
      </Grid>
      <Grid container md={12}
            direction="row"
            justifyContent="space-evenly">
        {searchType === SEARCH_TYPES.BLOCK_HASH && (
          <Grid md={9}>
            <BlockhashSearchResult
              transactions={blockhashResult.block.transactions}
              blockId={blockhashResult.block.blockId}
              timestamp={blockhashResult.block.timestamp}
            />
          </Grid>
        )}
      </Grid>
      <Grid container md={12}
            direction="row"
            justifyContent="space-evenly">
        {searchType === SEARCH_TYPES.ADDRESS && (
          <Grid md={9}>
            <AddressSearchResult
              transactions={nodeAddressResult.transactions}
              balance={nodeAddressResult.balance}
              searchAddress={enteredSearchTerm}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default App
