import React, { useEffect, useRef, useState } from 'react';
import { PieChartOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Modal, Spin, theme, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import { DTOFeature } from '../dtos/feature.dto';
import { FeatureService, LogoutService, MenuService } from '../services/feature.service';
import type { DTOMenu } from '../dtos/menu.dto';
import logo from '../../../assets/logo.jpg';
import './layout-default.scss';
import Popper, { type PopperPlacementType } from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import LogoutIcon from '@mui/icons-material/Logout';

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
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [placement, setPlacement] = React.useState<PopperPlacementType>('bottom-end');
  const [loading, setLoading] = useState<boolean>(false);
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

  const handleClick =
    (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setOpenProfile((prev) => !prev);
      setPlacement(newPlacement);
    };

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

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk: () => {
        setLoading(true);
        LogoutService().then(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
          setLoading(false);
        });
      },
    });
  };

  return (
    <Spin spinning={loading}>
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
        <Header className="header-layout">
          <div className="header-logo-container">
            <img
              src={logo}
              alt="logo"
              className="header-logo"
              onClick={handleClick('bottom-end')}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </Header>
        <Popper
          sx={{ zIndex: 1200 }}
          open={openProfile}
          anchorEl={anchorEl}
          placement={placement}
          transition
          className="popper-container"
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Typography>
                  <div className="popup-container">
                    <button className="popup-btn" onClick={handleLogout}>
                      <LogoutIcon sx={{ fontSize: 16, mr: 1 }} />
                      <p>Đăng xuất</p>
                    </button>
                  </div>
                </Typography>
              </Paper>
            </Fade>
          )}
        </Popper>
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
    </Spin>
  );
};

export default layoutDefault;
