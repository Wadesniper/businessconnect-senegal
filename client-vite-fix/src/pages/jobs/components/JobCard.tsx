import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Typography, Button, Avatar } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, BankOutlined, EditOutlined, DeleteOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import type { JobData as Job } from '../../../types/job';
import styled from '@emotion/styled';
import LazyImage from '../../../components/LazyImage';
import { useAuth } from '../../../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

interface JobCardProps {
  job: Job;
  isPremium?: boolean;
  onEdit?: (jobId: string) => void;
  onDelete?: (jobId:string) => void;
}

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }

  .ant-card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CardContent = styled.div`
  flex-grow: 1;
`;

const CardFooter = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const JobCard: React.FC<JobCardProps> = ({ job, isPremium, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!job) {
    return null;
  }

  const {
    id,
    title = 'Titre non disponible',
    company = 'Entreprise non spécifiée',
    location = 'Lieu non spécifié',
    description = 'Pas de description.',
    companyLogo,
    type,
    sector,
    employerId,
  } = job;
  
  const isOwner = user && employerId === user.id;
  const isAdmin = user?.role === 'admin';

  const handleViewDetails = () => {
    if (isPremium || isOwner || isAdmin) {
        navigate(`/jobs/${id}`);
    } else {
        navigate('/subscription');
    }
  };

  return (
    <StyledCard hoverable>
        <CardHeader>
            {companyLogo ? (
                <Avatar src={companyLogo} size={50} />
            ) : (
                <Avatar icon={<BankOutlined />} size={50} />
            )}
            <div>
                <Title level={5} style={{ marginBottom: 0, lineHeight: 1.2 }} ellipsis={{rows: 2}}>{title}</Title>
                <Text type="secondary">{company}</Text>
            </div>
        </CardHeader>
      <CardContent>
        <Paragraph ellipsis={{ rows: 3, expandable: false }} style={{ marginBottom: 12 }}>
            {description}
        </Paragraph>
        <div>
          {location && <Tag icon={<EnvironmentOutlined />} color="blue">{location}</Tag>}
          {type && <Tag icon={<ClockCircleOutlined />} color="green">{type}</Tag>}
          {sector && <Tag color="purple">{sector}</Tag>}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
            type="primary" 
            block 
            onClick={handleViewDetails} 
            icon={isPremium || isOwner || isAdmin ? <EyeOutlined /> : <LockOutlined />}
            style={{ background: '#1ec773', borderColor: '#1ec773' }}
        >
          {isPremium || isOwner || isAdmin ? 'Voir les détails' : 'Accès Premium'}
        </Button>
        {(isOwner || isAdmin) && onEdit && onDelete && (
            <div style={{display: 'flex', gap: '8px'}}>
                <Button block icon={<EditOutlined />} onClick={() => onEdit(id)}>Modifier</Button>
                <Button block danger icon={<DeleteOutlined />} onClick={() => onDelete(id)}>Supprimer</Button>
            </div>
        )}
      </CardFooter>
    </StyledCard>
  );
};

export default JobCard; 