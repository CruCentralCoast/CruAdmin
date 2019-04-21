import * as React from 'react';
import './NotFound.css';

class NotFound extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    return (
        <div className="NotFound">
          Page Not Found
        </div>
    );
  }
}

export default NotFound;
