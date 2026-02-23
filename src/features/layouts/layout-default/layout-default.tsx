import React, { useEffect, useRef, useState } from 'react';
import { PieChartOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import { DTOFeature } from '../dtos/feature.dto';
import { FeatureService, MenuService } from '../services/feature.service';
import type { DTOMenu } from '../dtos/menu.dto';
import logo from '../../../assets/logo.jpg';
import './layoutAdmin.scss';

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
  const navigate = useNavigate();

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
      const data = res.data;

      const menus: MenuItem[] = data.map((feature: any) =>
        getItem(
          feature.name,
          feature.code,
          <PieChartOutlined />,
          feature.menu.map((m: any) => getItem(m.name, m.path, <UserOutlined />)),
        ),
      );

      setMenuItems(menus);
    } catch (error) {
      console.error('Load menu error', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        theme="light"
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo" />
        </div>
        <Menu theme="light" mode="inline" items={menuItems} onClick={(e) => navigate(e.key)} />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
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
