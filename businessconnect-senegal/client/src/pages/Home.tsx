import React, { useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space, Avatar, Rate, Tag, Carousel } from 'antd';
import { motion, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';
import Hero from '../components/Hero/index';
import type { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';
import {
  TeamOutlined,
  ShoppingOutlined,
  BookOutlined,
  BulbOutlined,
  ArrowRightOutlined,
  UserOutlined,
  BuildOutlined,
  SearchOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  RiseOutlined
} from '@ant-design/icons';
import styles from './Home.module.css';
import { useNavigate, Link } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// ... (le reste du code est inchangé, copié depuis temp-bc-client/src/pages/Home.tsx) 