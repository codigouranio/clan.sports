import { Box, CircularProgress, Skeleton, Zoom } from "@mui/material";
import React from "react";

interface TrophyItemProps {
  src: string; // Assuming url is a string
  alt: string; // Assuming alt is a string
  loading: boolean;
}

export default function TrophyItem({ src, alt, loading = true }: TrophyItemProps) {
  return (
    <React.Fragment>
      {
        loading &&
        <Skeleton animation="wave" variant="rectangular" width={500} height={500} />
      }
      {
        !loading && src &&
        <Zoom in={true}>
          <div className="trophy-border image-wrapper shine">
            <img src={src} alt={alt} />
          </div>
        </Zoom>
      }
    </React.Fragment >

  );
}