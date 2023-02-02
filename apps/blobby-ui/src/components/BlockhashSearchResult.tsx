import React from 'react'
import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core'
import TransactionDto from '../dtos/transaction.dto'
import TransactionsTable from './common/TransactionsTable'

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
        <TransactionsTable transactions={props.transactions} />
      </CardContent>
    </Card>
  )
}

export default BlockhashSearchResult
