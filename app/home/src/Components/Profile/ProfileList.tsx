import { Grid } from '@mui/material';
import useDataFetching from '../../Fetch';
import CardAdd from '../CardAdd';
import ProfileCard from './ProfileCard';

export default function ProfileList() {

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
        <Grid item>
          <CardAdd itemType={"Profile"}></CardAdd>
        </Grid>
        {items && items.map((item: any, index: number) => (
          <Grid item key={index}>
            <ProfileCard />
          </Grid>
        ))}
      </Grid>
    </div >
  );
}


