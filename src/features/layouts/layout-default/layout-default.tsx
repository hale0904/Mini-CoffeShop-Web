import React, { useEffect, useRef, useState } from 'react';
import { PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Modal, Spin, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from 'antd/es/layout/layout';
import { LogoutService, MenuService } from '../services/feature.service';
import logo from '../../../assets/logo.jpg';
import './layout-default.scss';
import Popper, { type PopperPlacementType } from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import LogoutIcon from '@mui/icons-material/Logout';
import { menuIconMap, subMenuIcon } from '../menudata/menudata';

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [placement, setPlacement] = React.useState<PopperPlacementType>('bottom-end');
  const [loading, setLoading] = useState<boolean>(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    loadFeatures();
  }, []);

  // Xử lý mở menu profile
  const handleClick =
    (newPlacement: PopperPlacementType) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setOpenProfile((prev) => !prev);
      setPlacement(newPlacement);
    };

  // Load menu từ API hoặc cache
  const loadFeatures = async () => {
    setLoading(true);

    try {
      let data;

      const cached = localStorage.getItem('menu');

      if (cached) {
        data = JSON.parse(cached);
      } else {
        const res = await MenuService();
        data = res.data;

        localStorage.setItem('menu', JSON.stringify(data));
      }

      const menus: MenuItem[] = data.map((feature: any) =>
        getItem(
          feature.name,
          feature.code,
          menuIconMap[feature.code] ? (
            React.createElement(menuIconMap[feature.code])
          ) : (
            <PieChartOutlined />
          ),
          feature.menu.map((m: any) =>
            getItem(
              m.name,
              m.path,
              subMenuIcon[m.code] ? React.createElement(subMenuIcon[m.code]) : <PieChartOutlined />,
            ),
          ),
        ),
      );

      setMenuItems(menus);
      // tìm parent theo route hiện tại
      const activeParent = data.find((feature: any) =>
        feature.menu.some((m: any) => m.path === location.pathname),
      );

      if (activeParent) {
        setOpenKeys([activeParent.code]);
      } else {
        // nếu chưa có route cụ thể thì mở menu đầu tiên
        if (data?.length > 0) {
          setOpenKeys([data[0].code]);
        }

        // nếu đang ở root thì tự chuyển vào menu đầu tiên
        const firstMenuPath = data?.[0]?.menu?.[0]?.path;

        if ((location.pathname === '/' || location.pathname === '') && firstMenuPath) {
          navigate(firstMenuPath);
        }
      }
    } catch (error) {
      localStorage.removeItem('menu');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng xuất
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
          localStorage.removeItem('menu');
          navigate('/login');
          setLoading(false);
        });
      },
    });
  };

  //#region UI
  return (
    <Spin spinning={loading} className="spin">
      <Layout className="layout">
        <Sider
          collapsible
          collapsed={collapsed}
          theme="light"
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo-container">
            <img src={logo} alt="logo" className="logo" />
          </div>
          <Menu
            theme="light"
            mode="inline"
            items={menuItems}
            selectedKeys={[location.pathname]}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
            onClick={(e) => navigate(e.key)}
            openKeys={openKeys}
          />
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
              <Fade {...TransitionProps} timeout={350} >
                <Paper>
                    <div className="popup-container">
                      <button className="popup-btn" onClick={handleLogout}>
                        <LogoutIcon sx={{ fontSize: 16, mr: 1 }} />
                        <p>Đăng xuất</p>
                      </button>
                    </div>  
                </Paper>
              </Fade>
            )}
          </Popper>
          <Content className="content">
            <div className="content-detail">
              <Outlet />
            </div>
          </Content>

          <Footer className="footer">
            <p>Hale Coffee ©2026</p>
          </Footer>
        </Layout>
      </Layout>
    </Spin>
  );
};

export default layoutDefault;
