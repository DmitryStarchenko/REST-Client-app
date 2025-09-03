'use client';

import { NextPage } from 'next';

import Button from '@/components/Button';

const MainPage: NextPage = () => {
  return (
    <div>
      MainPage
      <Button
        label="MainPage btn"
        onClick={() => {
          console.log('main page btn clicked');
        }}
      />
    </div>
  );
};

export default MainPage;
