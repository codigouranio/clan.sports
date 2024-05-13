import { Skeleton, Zoom } from "@mui/material";
import React from "react";
import Confetti from 'react-confetti';
import { useWindowSize, useTimeout } from 'react-use'

interface TrophyItemProps {
  src: string; // Assuming url is a string
  alt: string; // Assuming alt is a string
  loading: boolean;
}

export default function TrophyItem({ src, alt, loading = true }: TrophyItemProps) {
  const { width } = useWindowSize();
  const [isComplete] = useTimeout(9000);
  var totalHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  return (
    <React.Fragment>
      {
        loading &&
        <Skeleton animation="wave" variant="rectangular" width={500} height={500} />
      }
      {
        !loading && src &&
        <React.Fragment>
          <Confetti
            width={width}
            height={totalHeight}
            tweenDuration={3000}
            recycle={!isComplete()}
          />
          <Zoom in={true}>
            <div className="trophy-border image-wrapper shine">
              <img src={src} alt={alt} />
            </div>
          </Zoom>

        </React.Fragment>
      }
    </React.Fragment >

  );
}