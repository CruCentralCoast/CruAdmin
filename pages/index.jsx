import * as React from 'react';
import Layout from '../components/MyLayout';

const Index = () => <Layout>
  <h1>Welcome</h1>
  <p>
    This is the home of the Admin Portal for the Cru App developed by Cru Central Coast.
    <br />
    We are working hard to get everything working on this site. In time this page will become a dashboard with helpful metrics.
    <br />
    Please be patient with us as we finish building out this site. We are a very small team who is working on this in their free time.
    <br />
    If you are having any issues please reach out to Kyle Fletcher and he can direct the issue to the appropriate party.
  </p>
  <style jsx>
    {`
    h1,
    a {
      font-family: 'Arial';
    }
  `}

  </style>
</Layout>;

export default Index;
