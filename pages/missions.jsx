import * as React from 'react';
import Layout from '../components/MyLayout';
import Missions from '../components/missions/Missions';

const MissionsComponent = () => <div style={{ margin: '35px'}}>
  <Layout >
    <Missions />
  </Layout>
</div>;

export default MissionsComponent;
