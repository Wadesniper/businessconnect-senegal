import React, { useState } from 'react';
import { Card, Avatar, Button, Form, Input, message, Upload } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import SEO from '../../components/SEO';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({ name: user?.fullName, email: user?.email });
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async (values: any) => {
    // Appel API pour sauvegarder les infos (à adapter selon ton backend)
    message.success('Profil mis à jour !');
    setEditing(false);
  };

  const handleAvatarChange = (info: any) => {
    if (info.file.status === 'done') {
      setAvatarUrl(info.file.response.url);
      message.success('Avatar mis à jour !');
    }
  };

  return (
    <>
      <SEO title="Mon profil - BusinessConnect Sénégal" />
      <Card style={{ maxWidth: 500, margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={96} src={avatarUrl} icon={<UserOutlined />} />
          <div style={{ marginTop: 8 }}>
            <Upload
              name="avatar"
              showUploadList={false}
              action="/api/users/avatar/upload"
              onChange={handleAvatarChange}
            >
              <Button icon={<UploadOutlined />}>Changer l'avatar</Button>
            </Upload>
          </div>
        </div>
        {editing ? (
          <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ name: user?.fullName, email: user?.email }}>
            <Form.Item label="Nom" name="name" rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}> 
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Veuillez entrer votre email' }]}> 
              <Input disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Enregistrer</Button>
              <Button style={{ marginLeft: 8 }} onClick={handleCancel}>Annuler</Button>
            </Form.Item>
          </Form>
        ) : (
          <>
            <p><b>Nom :</b> {user?.fullName}</p>
            <p><b>Email :</b> {user?.email}</p>
            <Button onClick={handleEdit}>Modifier</Button>
          </>
        )}
      </Card>
    </>
  );
};

export default ProfilePage; 