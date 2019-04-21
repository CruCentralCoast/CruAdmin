import Header from './heading/Heading'

const Layout = (props) => (
  <div style={{display: 'flex'}}>
    <Header>
      {props.children}
    </Header>
  </div>
)

export default Layout