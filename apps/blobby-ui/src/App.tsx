import React from 'react'
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
            <FormLabel id="search-by">Search By</FormLabel>
            <RadioGroup
              row
              aria-labelledby="search-by"
              defaultValue="transaction_id"
              name="search-by-group"
            >
              <FormControlLabel value="transaction_id" control={<Radio/>} label="Transaction Id"/>
              <FormControlLabel value="block_hash" control={<Radio/>} label="Block Hash"/>
              <FormControlLabel value="address" control={<Radio/>} label="Address"/>
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
