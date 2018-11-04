import * as React from 'react';
import './NotFound.css';

class NotFound extends React.Component <any, any> {
  constructor (props: any) {
    super(props);
  }

  public render() {
    return (
        <div className="NotFound">
          Page Not Found
        </div>
    );
  }
}

export default NotFound;
