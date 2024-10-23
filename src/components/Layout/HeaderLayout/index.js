import React from 'react'
import { Image, Layout, Menu } from "antd"
import { UserOutlined } from '@ant-design/icons'

const HeaderLayout = () => {
    
    const { Header } = Layout
    
    return (

            <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', flex: '1 1 30%', }}>
                <div className='demo-logo'/>
                <Menu
                theme='dark'
                mode="horizontal"
                items=
                {[  
                    {
                        key: '1',
                        icon: <UserOutlined/>,
                        label: 'nav1'
                    },
                    {
                        key: '2',
                        icon: <UserOutlined/>,
                        label: 'nav2'
                    },
                    {
                        key: '3',
                        icon: <UserOutlined/>,
                        label: 'nav3'
                    },
                ]}
                style={{ flex: 1, minWidth: 0,}}
                />

                
            </Header>
        </Layout>
    )
}



export default HeaderLayout