import React from 'react'
import { Card, CardContent, Grid, Typography } from '@material-ui/core'

export type TransactionSearchResultProps = {
  sender: string
  receiver: string
  amount: number
  transactionId?: string
}

const TransactionSearchResult: React.FC<TransactionSearchResultProps> = props => {
  return (
    <Card>
      <CardContent>
        <Typography color="primary" variant="overline">
          Transaction result for {props.transactionId}
        </Typography>
        <Grid direction="row" container md={12} justifyContent="space-between">
          <Typography color="textSecondary">
            Sender
          </Typography>
          <Typography color="secondary">
            {props.sender}
          </Typography>
        </Grid>
        <Grid direction="row" container md={12} justifyContent="space-between">
          <Typography color="textSecondary">
            Receiver
          </Typography>
          <Typography color="secondary">
            {props.receiver}
          </Typography>
        </Grid>
        <Grid direction="row" container md={12} justifyContent="space-between">
          <Typography color="textSecondary">
            Amount
          </Typography>
          <Typography color="secondary">
            {props.amount}
          </Typography>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default TransactionSearchResult
