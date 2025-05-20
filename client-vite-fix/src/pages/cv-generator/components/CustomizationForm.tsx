import React from 'react';
import { Form, Select, Space, Typography, ColorPicker, Divider, message } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { CustomizationOptions } from '../../../types/cv';

const { Title } = Typography;

interface CustomizationFormProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
  isPremium: boolean;
}

const fontFamilies = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
  { value: 'Poppins, sans-serif', label: 'Poppins' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' }
];

const fontSizes = [
  { value: '12px', label: 'Petit (12px)' },
  { value: '14px', label: 'Normal (14px)' },
  { value: '16px', label: 'Moyen (16px)' },
  { value: '18px', label: 'Grand (18px)' }
];

const spacingOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Confortable' },
  { value: 'spacious', label: 'Spacieux' }
];

const CustomizationForm: React.FC<CustomizationFormProps> = ({ options, onChange, isPremium }) => {
  const [form] = Form.useForm<CustomizationOptions>();

  const handleColorChange = (type: 'primaryColor' | 'secondaryColor', color: Color) => {
    const newOptions = {
      ...options,
      [type]: color.toHexString()
    };
    onChange(newOptions);
    message.success(`Couleur ${type === 'primaryColor' ? 'principale' : 'secondaire'} mise à jour`);
  };

  const handleChange = (field: keyof CustomizationOptions, value: string) => {
    const newOptions = {
      ...options,
      [field]: value
    };
    onChange(newOptions);
    message.success(`${field} mis à jour`);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={options}
    >
      <Title level={3}>Personnalisation du CV</Title>

      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Couleurs */}
        <div>
          <Title level={4}>Couleurs</Title>
          <Space size={16}>
            <Form.Item label="Couleur principale">
              <ColorPicker
                value={options.primaryColor}
                onChange={(color) => handleColorChange('primaryColor', color)}
                presets={[
                  {
                    label: 'Couleurs recommandées',
                    colors: [
                      '#1890ff', '#52c41a', '#faad14', '#f5222d',
                      '#722ed1', '#13c2c2', '#2f54eb', '#eb2f96'
                    ],
                  }
                ]}
              />
            </Form.Item>

            <Form.Item label="Couleur secondaire">
              <ColorPicker
                value={options.secondaryColor}
                onChange={(color) => handleColorChange('secondaryColor', color)}
                presets={[
                  {
                    label: 'Couleurs recommandées',
                    colors: [
                      '#69c0ff', '#95de64', '#ffd666', '#ff7875',
                      '#b37feb', '#5cdbd3', '#85a5ff', '#ff85c0'
                    ],
                  }
                ]}
              />
            </Form.Item>
          </Space>
        </div>

        <Divider />

        {/* Typographie */}
        <div>
          <Title level={4}>Typographie</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              label="Police de caractères"
              extra="La police affectera l'apparence générale de votre CV"
            >
              <Select
                value={options.fontFamily}
                onChange={(value) => handleChange('fontFamily', value)}
                options={fontFamilies}
                style={{ width: 200 }}
              />
            </Form.Item>

            <Form.Item
              label="Taille de police"
              extra="Choisissez une taille confortable pour la lecture"
            >
              <Select
                value={options.fontSize}
                onChange={(value) => handleChange('fontSize', value)}
                options={fontSizes}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Space>
        </div>

        <Divider />

        {/* Mise en page */}
        <div>
          <Title level={4}>Mise en page</Title>
          <Form.Item
            label="Espacement"
            extra="L'espacement affecte la densité du contenu dans votre CV"
          >
            <Select
              value={options.spacing}
              onChange={(value) => handleChange('spacing', value)}
              options={spacingOptions}
              style={{ width: 200 }}
            />
          </Form.Item>
        </div>

        {/* Aperçu en temps réel */}
        <div style={{ marginTop: 24 }}>
          <Title level={4}>Aperçu du style</Title>
          <div
            style={{
              padding: 16,
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              backgroundColor: '#fff'
            }}
          >
            <div style={{
              fontFamily: options.fontFamily,
              fontSize: options.fontSize,
              color: options.primaryColor
            }}>
              <h1 style={{ color: options.primaryColor }}>Titre exemple</h1>
              <p style={{ color: options.secondaryColor }}>
                Ceci est un exemple de texte qui montre comment votre CV apparaîtra
                avec les styles sélectionnés.
              </p>
            </div>
          </div>
        </div>
      </Space>
    </Form>
  );
};

export default CustomizationForm; 