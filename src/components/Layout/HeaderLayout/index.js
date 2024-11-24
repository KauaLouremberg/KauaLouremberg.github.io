import React from 'react';
import { Form, Layout, Menu } from "antd";
import Search from 'antd/es/transfer/search';

const HeaderLayout = ({ onSearch }) => {
  const { Header } = Layout;

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          flex: '1 1 30%',
          backgroundColor: "#FAA958"
        }}
      >
        <div className='demo-logo' />
        <Menu
          theme='dark'
          mode="horizontal"
          style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: "#FAA958"
          }}
        >
          <h1 style={{ color: "#FFFFFF", marginTop: "15px" }}>
            JOAQUIM NOGUEIRA BLOG
          </h1>
          <Form.Item
            style={{
              alignContent: "center",
              marginLeft: "600px",
              marginTop: "35px"
            }}
          >
            <Search
              placeholder="Buscar"
              enterButton="Search"
              size="large"
              onSearch={onSearch} // Conectando ao evento de busca
            />
          </Form.Item>
        </Menu>
      </Header>
    </Layout>
  );
};

export default HeaderLayout;
