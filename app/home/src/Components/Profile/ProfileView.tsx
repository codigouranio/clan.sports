import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import useDataFetching from "../../useDataFetching";

export const ProfileView: React.FC<any> = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams);

  const profile_unique_id = searchParams.get("id") || "unknown";

  const { data, loading, error } = useDataFetching(
    `/api/profile/${profile_unique_id}`
  );

  console.log([">>>>>", data, loading, error]);

  if (data?.items && data?.items.length) {
    const profile_data = data.items[0];
    return (
      <React.Fragment>
        <Container component="main" maxWidth="md">
          <h1>{profile_data.name}</h1>
          <p>{profile_data.email}</p>
        </Container>
      </React.Fragment>
    );
  }

  console.log(data?.profile && data?.profile[profile_unique_id]);

  const profile = data?.profile ? data?.profile[profile_unique_id] : {};

  return (
    <React.Fragment>
      <h1>{JSON.stringify(searchParams.get("id") || "unknown")}</h1>
      <p>{JSON.stringify(searchParams.get("id") || "unknown")}</p>
      {Object.entries(profile).map(([key, value]) => (
        <Grid item xs={12} sm={4} key={key}>{`${value}`}</Grid>
      ))}
      <Container component="main" maxWidth="md" sx={{ margin: '2em' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4} sx={{ border: '2px solid black' }}>
            <Typography variant="h4" gutterBottom>{profile?.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={8} sx={{ border: '2px solid black' }}>
            <Typography variant="h4" gutterBottom>{profile?.last_name}</Typography>
          </Grid>
        </Grid>
        <Typography variant="body1">
          {profile?.bio}
        </Typography>
      </Container>
    </React.Fragment>
  );
}
