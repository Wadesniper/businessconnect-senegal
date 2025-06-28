import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Typography, Button, Avatar } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, ApartmentOutlined, EditOutlined, DeleteOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
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
  border-radius: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  }

  .ant-card-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
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

const isSpecified = (value: string | undefined | null) => value && !/non précisé|non spécifié/i.test(value);

// Utilitaire pour afficher le type de contrat en français
const getTypeLabel = (type: string | undefined) => {
  switch (type) {
    case 'full_time': return 'CDI';
    case 'part_time': return 'Temps partiel';
    case 'contract': return 'CDD / Freelance';
    case 'internship': return 'Stage / Alternance';
    case 'CDI': return 'CDI';
    case 'CDD': return 'CDD';
    case 'Stage': return 'Stage';
    case 'Freelance': return 'Freelance';
    case 'Alternance': return 'Alternance';
    case 'Temps partiel': return 'Temps partiel';
    default: return type || '';
  }
};

const JobCard: React.FC<JobCardProps> = ({ job, isPremium, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!job) {
    return null;
  }

  const {
    id,
    title = 'Titre non disponible',
    company,
    location,
    description = 'Pas de description.',
    companyLogo,
    type,
    sector,
    postedById,
  } = job;
  
  const isOwner = user && (postedById === user.id);
  const isAdmin = user?.role === 'admin';
  
  const hasAccess = isPremium || isOwner || isAdmin;

  const handleViewDetails = () => {
    if (!user) {
      navigate('/auth');
    } else if (hasAccess) {
      navigate(`/jobs/${id}`);
    } else {
      navigate('/subscription');
    }
  };

  return (
    <StyledCard hoverable>
        <CardHeader>
            {companyLogo ? (
                <Avatar src={companyLogo} size={50} style={{border: '3px solid #f0f0f0'}} />
            ) : (
                <Avatar icon={<ApartmentOutlined />} size={50} style={{backgroundColor: '#e6f7ff', color: '#1890ff', border: '3px solid #e6f7ff'}} />
            )}
            <div>
                <Title level={5} style={{ marginBottom: '4px', lineHeight: 1.3, fontWeight: 700, color: '#002766' }} ellipsis={{rows: 2}}>{title}</Title>
                {isSpecified(company) && <Text type="secondary" style={{fontSize: '0.9rem'}}>{company}</Text>}
            </div>
        </CardHeader>
      <CardContent>
        <Paragraph ellipsis={{ rows: 3, expandable: false }} style={{ marginBottom: 16, marginTop: 12, color: '#595959' }}>
            {description}
        </Paragraph>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {isSpecified(location) && <Tag icon={<EnvironmentOutlined />} color="blue" style={{ whiteSpace: 'normal', height: 'auto', lineHeight: '1.4' }}>{location}</Tag>}
          {isSpecified(type) && <Tag icon={<ClockCircleOutlined />} color="green" style={{ whiteSpace: 'normal', height: 'auto', lineHeight: '1.4' }}>{getTypeLabel(type)}</Tag>}
          {isSpecified(sector) && <Tag color="purple" style={{ whiteSpace: 'normal', height: 'auto', lineHeight: '1.4' }}>{sector}</Tag>}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
            type="primary" 
            block 
            onClick={handleViewDetails} 
            icon={hasAccess ? <EyeOutlined /> : <LockOutlined />}
            style={{ 
                background: 'linear-gradient(135deg, #1ec773, #28a745)', 
                borderColor: '#1ec773', 
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(30, 199, 115, 0.3)',
                height: '40px'
            }}
        >
          {hasAccess ? "Détails de l'offre" : 'Accès Premium'}
        </Button>
        {(isOwner || isAdmin) && onEdit && onDelete && (
            <div style={{display: 'flex', gap: '8px', marginTop: '12px'}}>
                <Button block icon={<EditOutlined />} onClick={() => onEdit(id)}>Modifier</Button>
                <Button block danger icon={<DeleteOutlined />} onClick={() => onDelete(id)}>Supprimer</Button>
            </div>
        )}
      </CardFooter>
    </StyledCard>
  );
};

export default JobCard; 