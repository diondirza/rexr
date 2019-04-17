import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Container } from '../styles';

const AboutView = () => {
  return (
    <>
      <Helmet>
        <title>About</title>
      </Helmet>
      <Container>ReXR, React SSR Boilerplate</Container>
    </>
  );
};

export default AboutView;
