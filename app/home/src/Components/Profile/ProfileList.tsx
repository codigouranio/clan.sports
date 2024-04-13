import { Grid } from '@mui/material';
import React from 'react';
import useDataFetching from '../../useDataFetching';
import CardAdd from '../CardAdd';
import ProfileCard from './ProfileCard';

export default function ProfileList() {

  const { data, loading, error } = useDataFetching('/api/profiles');
  console.log([data, loading, error]);

  const items: any[] = data?.items.profiles;

  return (
    <React.Fragment>
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
            <ProfileCard profile_data={item} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}


