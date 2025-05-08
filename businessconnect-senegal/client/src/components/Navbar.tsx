import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { 
  HomeOutlined, 
  ShoppingOutlined, 
  MessageOutlined, 
  ShopOutlined, 
  BookOutlined, 
  PhoneOutlined, 
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FileOutlined
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  width: 100%;
  padding: 0 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Logo = styled(Link)`
  float: left;
  height: 64px;
  padding: 15px 0;
  margin-right: 24px;
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
  &:hover {
    color: #40a9ff;
  }
`;

const StyledMenu = styled(Menu)`
  line-height: 64px;
  border-bottom: none;
`;

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Mon Profil</Link>
      </Menu.Item>
      {user?.role === 'admin' && (
        <Menu.Item key="admin" icon={<DashboardOutlined />}>
          <Link to="/admin">Administration</Link>
        </Menu.Item>
      )}
      <Menu.Item key="cv" icon={<FileOutlined />}>
        <Link to="/cv-generator">Mon CV</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  return (
    <NavbarContainer>
      <Logo to="/">BusinessConnect</Logo>
      <StyledMenu mode="horizontal" theme="light">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Accueil</Link>
        </Menu.Item>
        <Menu.Item key="jobs" icon={<ShoppingOutlined />}>
          <Link to="/jobs">Emplois</Link>
        </Menu.Item>
        <Menu.Item key="forum" icon={<MessageOutlined />}>
          <Link to="/forum">Forum</Link>
        </Menu.Item>
        <Menu.Item key="marketplace" icon={<ShopOutlined />}>
          <Link to="/marketplace">Marketplace</Link>
        </Menu.Item>
        <Menu.Item key="formations" icon={<BookOutlined />}>
          <Link to="/formations">Formations</Link>
        </Menu.Item>
        <Menu.Item key="contact" icon={<PhoneOutlined />}>
          <Link to="/contact">Contact</Link>
        </Menu.Item>

        {isAuthenticated ? (
          <Menu.Item key="user" style={{ float: 'right' }}>
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space>
                <Avatar icon={<UserOutlined />} src={user?.avatar} />
                {user?.fullName}
              </Space>
            </Dropdown>
          </Menu.Item>
        ) : (
          <>
            <Menu.Item key="login" style={{ float: 'right' }}>
              <Button type="primary">
                <Link to="/login">Connexion</Link>
              </Button>
            </Menu.Item>
            <Menu.Item key="register" style={{ float: 'right' }}>
              <Link to="/register">Inscription</Link>
            </Menu.Item>
          </>
        )}
      </StyledMenu>
    </NavbarContainer>
  );
};

export default Navbar; 