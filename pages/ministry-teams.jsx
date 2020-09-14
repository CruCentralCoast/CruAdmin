import * as React from 'react';
import Layout from '../components/MyLayout';
import MinistryTeams from '../components/ministry-teams/MinistryTeams';

const MinistryTeamsComponent = () => <div style={{ margin: '35px'}}>
  <Layout >
    <MinistryTeams />
  </Layout>
</div>;

export default MinistryTeamsComponent;
