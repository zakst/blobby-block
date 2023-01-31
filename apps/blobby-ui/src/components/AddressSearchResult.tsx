import React from 'react'
import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import TransactionDto from '../dtos/transaction.dto'
import TransactionsTable from './common/TransactionsTable'

export type AddressSearchResultProps = {
  searchAddress: string
  balance: number
  transactions: TransactionDto[]
}

const AddressSearchResult: React.FC<AddressSearchResultProps> = props => {
  return (

    <Card>
      <CardContent>
        <Typography color="primary" variant="overline">
          Address Result
        </Typography>
        <Grid direction="row" container md={12} justifyContent="space-between">
          <Typography color="textSecondary">
            Search for
          </Typography>
          <Typography color="secondary">
            {props.searchAddress}
          </Typography>
        </Grid>
        <Grid direction="row" container md={12} justifyContent="space-between">
          <Typography color="textSecondary">
            Balance
          </Typography>
          <Typography color="secondary">
            {props.balance}
          </Typography>
        </Grid>
        <TransactionsTable transactions={props.transactions} />
      </CardContent>
    </Card>
  )
}

export default AddressSearchResult
