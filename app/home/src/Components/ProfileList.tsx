import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
// import { useStorage } from '../Storage';
import useDataFetching from '../Fetch';

export default function ProfileList() {

  // const { storageState } = useStorage();

  const { data, loading, error } = useDataFetching('/api/profiles');
  console.log([data, loading, error]);

  // const items = Array.from({ length: 10 }, (_, index) => index + 1);
  const items: any[] = data?.items.profiles;

  return (
    <div>
      <h1>Profile List</h1>
      <Grid container spacing={3} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {items && items.map((item: any, index: number) => (
          <Grid item key={index}>
            <BasicCard />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export function BasicCard() {
  return (
    <Card sx={{ minWidth: 275, margin: 1 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}