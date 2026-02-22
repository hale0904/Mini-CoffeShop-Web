import React, { useEffect, useRef, useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

import { FeatureService, MenuService } from '../services/feature.service';
import { DTOFeature } from '../dtos/feature.dto';
import type { DTOMenu } from '../dtos/menu.dto';
import { Outlet } from 'react-router-dom';

const { Footer, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

const layoutDefault: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [features, setFeatures] = useState<DTOMenu[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // lifecycle tương đương ngOnInit
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
  try {
    const res = await MenuService();
    const data = res.data; // vì API bạn bọc trong { success, data }

    const menus: MenuItem[] = data.map((feature: any) =>
      getItem(
        feature.name,        // label
        feature.code,        // key
        <PieChartOutlined />, // icon menu cha
        feature.menu.map((m: any) =>
          getItem(
            m.name,          // label
            m.code,          // key
            <UserOutlined /> // icon menu con
          )
        )
      )
    );

    setMenuItems(menus);
  } catch (error) {
    console.error('Load menu error', error);
  }
};


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} theme="dark" onCollapse={(value) => setCollapsed(value)}>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Hale Coffee ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default layoutDefault;
