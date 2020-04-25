import React from 'react';
import './Upload.scss';
import { Button } from 'antd';

function Upload() {
  return (
    <div>
      <Button type="primary">Primary</Button>
      <Button>Default</Button>
      <Button type="dashed">Dashed</Button>
      <Button type="link">Link</Button>
  </div>
  )
}

export default Upload;