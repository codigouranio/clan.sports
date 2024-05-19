import React from "react";
import { useSearchParams } from "react-router-dom";
import useDataFetching from "../../useDataFetching";

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
      <h1>{trophy_unique_id}</h1>
      <h2>{trophy?.name}</h2>
      <img
        src={trophy?._links?.asset}
        alt={trophy?.name}
        style={{
          width: 'auto',
          display: trophy?.display || 'block'
        }}
      />
      {children}
    </React.Fragment>
  );
};

export default TrophyView;