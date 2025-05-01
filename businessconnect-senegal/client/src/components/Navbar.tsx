import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Button, Avatar, Badge, Drawer } from 'antd';
import { 
  MenuOutlined, 
  UserOutlined, 
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import NotificationBell from './NotificationBell';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const userMenu = (
    <Menu>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/dashboard">Tableau de bord</Link>
      </Menu.Item>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Mon Profil</Link>
      </Menu.Item>
      <Menu.Item key="cv" icon={<FileTextOutlined />}>
        <Link to="/cv-generator">Mon CV</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <Link to="/settings">Paramètres</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  const navigationLinks = [
    { to: "/jobs", label: "Offres d'emploi" },
    { to: "/companies", label: "Entreprises" },
    { to: "/formations", label: "Formations" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/forum", label: "Forum" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="BusinessConnect Sénégal"
              />
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navigationLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <Dropdown overlay={userMenu} trigger={['click']}>
                  <Button type="link" className="ant-dropdown-link flex items-center">
                    <Avatar 
                      size="small" 
                      src={user.avatar} 
                      icon={!user.avatar && <UserOutlined />}
                    />
                    <span className="ml-2">{user.fullName}</span>
                    <DownOutlined className="ml-1" />
                  </Button>
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Menu mobile */}
          <div className="flex md:hidden items-center">
            {user && <NotificationBell />}
            <Button
              type="text"
              icon={mobileMenuVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
              className="ml-4"
            />
          </div>
        </div>
      </div>

      {/* Drawer mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        visible={mobileMenuVisible}
        className="md:hidden"
      >
        <div className="flex flex-col space-y-4">
          {user && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Avatar 
                size="large" 
                src={user.avatar} 
                icon={!user.avatar && <UserOutlined />}
              />
              <div>
                <div className="font-medium">{user.fullName}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
          )}

          {navigationLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium block"
              onClick={() => setMobileMenuVisible(false)}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <div className="border-t border-gray-200 my-4" />
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 px-3 py-2"
                onClick={() => setMobileMenuVisible(false)}
              >
                <DashboardOutlined />
                <span>Tableau de bord</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 px-3 py-2"
                onClick={() => setMobileMenuVisible(false)}
              >
                <UserOutlined />
                <span>Mon Profil</span>
              </Link>
              <Link
                to="/cv-generator"
                className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 px-3 py-2"
                onClick={() => setMobileMenuVisible(false)}
              >
                <FileTextOutlined />
                <span>Mon CV</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 px-3 py-2"
                onClick={() => setMobileMenuVisible(false)}
              >
                <SettingOutlined />
                <span>Paramètres</span>
              </Link>
              <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={() => {
                  logout();
                  setMobileMenuVisible(false);
                }}
                className="w-full text-left px-3 py-2"
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-200 my-4" />
              <Link
                to="/login"
                className="block text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuVisible(false)}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                onClick={() => setMobileMenuVisible(false)}
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar; 