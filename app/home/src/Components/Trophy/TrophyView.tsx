import React from "react";
import { useSearchParams } from "react-router-dom";
import useDataFetching from "../../useDataFetching";
import { Box, Container, Grid, LinearProgress, Paper, Zoom } from "@mui/material";

const TrophyView: React.FC<any> = ({ children }) => {

  const [searchParams] = useSearchParams();
  const trophy_unique_id = searchParams.get("id") || "unknown";

  const { data, loading, error } = useDataFetching(
    `/api/trophy/${trophy_unique_id}`
  );

  // const trophy = trophies[trophy_unique_id];
  const trophy = data?.items?.trophies ? data?.items?.trophies[trophy_unique_id] : {};

  console.log(trophy);

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <h1>{trophy?.name}</h1>
      </Container>
      {/* {JSON.stringify(trophy)} */}
      <Box
        sx={{
          display: 'flex',
          minHeight: 'auto',
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              justifyContent: "center"
            }}
          >
            <Zoom timeout={1000} in={true}>
              <img
                src={trophy?._links?.asset}
                alt={trophy?.name}
                style={{
                  width: 'auto',
                  display: trophy?.display || 'block'
                }}
              />
            </Zoom>
          </Box>
        </Container>
      </Box>
      {children}
    </React.Fragment>
  );
};

export default TrophyView;