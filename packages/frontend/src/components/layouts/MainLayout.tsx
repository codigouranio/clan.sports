import React from 'react';

import { HeadComponent } from '../atoms';

interface Props {
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <HeadComponent />
      <main>{children}</main>
    </div>
  );
};
