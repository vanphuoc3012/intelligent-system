import 'regenerator-runtime';
import React from 'react';
import Head from 'next/head';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

import CustomDivider from '../components/CustomDivider';
import Description from '../components/Description';
import Hero from '../components/Hero';
import Spacer from '../components/Spacer';

const Home = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>
          Home | Loan Approval Prediction
        </title>
      </Head>
      <Hero />
      <CustomDivider />
      <Description />
      <Spacer sx={{ pt: 20}} />
    </>
  );
};

export default Home;