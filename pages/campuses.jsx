import * as React from 'react';
import Layout from '../components/MyLayout';
import Campuses from '../components/campuses/Campuses';

const CampusesComponent = () => <div style={{ margin: '35px'}}>
  <Layout >
    <Campuses />
  </Layout>
</div>;

export default CampusesComponent;
