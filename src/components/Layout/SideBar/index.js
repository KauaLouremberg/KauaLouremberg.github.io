import { Menu } from 'antd';
import React from 'react';

const Sidebar = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'absolute' }}>
      <div
        style={{
          width: '200px',
          backgroundColor: '#001529',
          color: '#fff',
          padding: '20px 0',
        }}
      >
        <Menu
          mode="inline"
          theme="dark"
          items={[
            
          ]}
        />
      </div>
    </div>
  );
};

export default Sidebar;
