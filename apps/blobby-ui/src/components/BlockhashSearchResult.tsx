import React from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import TransactionDto from '../dtos/transaction.dto'

export type BlockhashSearchResultProps = {
  blockId: number
  timestamp: number
  transactions: TransactionDto[]
}

const BlockhashSearchResult: React.FC<BlockhashSearchResultProps> = props => {
  const blockDate = new Date(props.timestamp).toLocaleDateString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'long'
  })

  return (
    <Card>
      <CardContent>
        <Typography color="primary" variant="overline">
          Block hash result
        </Typography>
        <Typography color="secondary" variant="subtitle2">
          {`BlockId: ${props.blockId} - Mined on: ${blockDate}`}
        </Typography>
        <Grid direction="row" container md={12} justifyContent="space-between">
          <TableContainer>
            <Table aria-label="Transactions Table">
              <TableHead>
                <TableRow>
                  <TableCell>Sender</TableCell>
                  <TableCell>Receiver</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.transactions.map((transaction) => (
                  <TableRow
                    key={transaction.transactionId}
                  >
                    <TableCell component="th" scope="row">
                      {transaction.sender}
                    </TableCell>
                    <TableCell>{transaction.receiver}</TableCell>
                    <TableCell align="right">{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

      </CardContent>
    </Card>
  )
}

export default BlockhashSearchResult
