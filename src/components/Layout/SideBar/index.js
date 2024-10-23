import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useState } from 'react'
import React from 'react'

const { Sider } = Layout

const Sidebar = () => {

    const [collapsed, setCollapsed] = useState(false);
    
    return(

        <Layout>
            <Sider trigger={null} collapsedWidth="0" collapsible collapsed={collapsed}  width={200} style={{ overflow: 'auto', zIndex: 2,}}>
                <Menu
                    mode='inline'
                    items=
                    {[
                        {
                            key: '1',
                            icon: <UserOutlined/>, 
                            label: 'testenav1'
                        },
                        {
                            key: '2',
                            icon: <UserOutlined/>, 
                            label: 'testenav2'
                        },
                        {
                            key: '3',
                            icon: <UserOutlined/>, 
                            label: 'testenav3'
                        },
                        {
                            key: '4',
                            icon: <UserOutlined/>, 
                            label: 'testenav4'
                        },
                        {
                            key: '5',
                            icon: <UserOutlined/>, 
                            label: 'testenav5'
                        },
                    ]}
                style={{padding: '6rem 20px 45rem',}}
                />
    
                
            </Sider>
        </Layout>
    
    )  
}

  

export default Sidebar