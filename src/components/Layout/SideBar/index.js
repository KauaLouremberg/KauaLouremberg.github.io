import { Layout, Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useState } from 'react'
import React from 'react'

const { Sider } = Layout

const Sidebar = () => {

    const [collapsed, setCollapsed] = useState(false);
    
    return(

        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
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
                        }
                    ]}
                
                />
    
                
            </Sider>
        </Layout>
    
    )  
}

  

export default Sidebar