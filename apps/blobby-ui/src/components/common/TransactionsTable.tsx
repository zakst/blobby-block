import React from 'react'
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import TransactionDto from '../../dtos/transaction.dto'

export type TransactionsTabletProps = {
  transactions: TransactionDto[]
}

const TransactionsTable: React.FC<TransactionsTabletProps> = props => {
  return (
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
  )
}

export default TransactionsTable
