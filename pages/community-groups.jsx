import * as React from 'react';
import Layout from '../components/MyLayout';
import CommunityGroups from '../components/community-groups/CommunityGroups';

const CommunityGroupsComponent = () => <div style={{ margin: '35px'}}>
  <Layout >
    <CommunityGroups />
  </Layout>
</div>;

export default CommunityGroupsComponent;
