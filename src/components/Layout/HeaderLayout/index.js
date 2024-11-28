import React from "react";
import { Form, Layout, Menu, Input } from "antd";
const { Search } = Input;

const HeaderLayout = ({ onSearch }) => {
  const { Header } = Layout;

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          flex: "1 1 30%",
          backgroundColor: "#FAA958",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{
            display: "flex", // Makes the menu a flex container
            justifyContent: "space-between", // Distributes the content with space between
            flex: 1, // Ensures the menu takes the available space
            backgroundColor: "#FAA958",
            padding: 0, // Remove extra padding if necessary
          }}
        >
          <h1
            style={{
              color: "#FFFFFF",
              marginTop: "15px",
              marginRight: "200px",
            }}
          >
            JOAQUIM NOGUEIRA BLOG
          </h1>
          <Form.Item
            style={{
              alignContent: "center",
              marginLeft: "600px",
              marginTop: "30px",
            }}
          >
            <Search
              placeholder="O que está procurando?"
              size="medium"
              onSearch={onSearch}
              style={{
                width: 250, // Set the width of the search bar
                marginLeft: "auto", // Pushes the search bar to the right
              }}
            />
          </Form.Item>
        </Menu>
      </Header>
    </Layout>
  );
};

export default HeaderLayout;
