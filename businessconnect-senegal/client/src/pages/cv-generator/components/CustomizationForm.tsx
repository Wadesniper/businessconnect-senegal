import React from 'react';
import { Form, Select, Typography, Space, Divider } from 'antd';
import { ColorPicker } from 'antd';
import { CustomizationOptions } from '../types';

const { Title } = Typography;

interface CustomizationFormProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
}

const fontFamilies = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Open Sans', value: 'Open Sans, sans-serif' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif' },
  { label: 'Poppins', value: 'Poppins, sans-serif' },
];

const fontSizes = [
  { label: 'Petit (12px)', value: '12px' },
  { label: 'Normal (14px)', value: '14px' },
  { label: 'Grand (16px)', value: '16px' },
  { label: 'Très grand (18px)', value: '18px' },
];

const spacingOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Confortable', value: 'comfortable' },
  { label: 'Spacieux', value: 'spacious' },
];

const CustomizationForm: React.FC<CustomizationFormProps> = ({ options, onChange }) => {
  const handleChange = (field: keyof CustomizationOptions, value: any) => {
    onChange({
      ...options,
      [field]: value,
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Personnalisation du CV
      </Title>

      <Form layout="vertical">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={4}>Couleurs</Title>
            <Space size="large">
              <Form.Item label="Couleur principale">
                <ColorPicker
                  value={options.primaryColor}
                  onChange={(color) => handleChange('primaryColor', color.toHexString())}
                  presets={[
                    {
                      label: 'Recommandé',
                      colors: [
                        '#1890ff', '#52c41a', '#722ed1', '#eb2f96',
                        '#faad14', '#13c2c2', '#2f54eb', '#fa541c',
                      ],
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Couleur secondaire">
                <ColorPicker
                  value={options.secondaryColor}
                  onChange={(color) => handleChange('secondaryColor', color.toHexString())}
                  presets={[
                    {
                      label: 'Recommandé',
                      colors: [
                        '#f5f5f5', '#d9d9d9', '#bfbfbf', '#8c8c8c',
                        '#595959', '#434343', '#262626', '#141414',
                      ],
                    },
                  ]}
                />
              </Form.Item>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>Typographie</Title>
            <Space size="large">
              <Form.Item label="Police de caractères" style={{ minWidth: 200 }}>
                <Select
                  value={options.fontFamily}
                  onChange={(value) => handleChange('fontFamily', value)}
                  options={fontFamilies}
                />
              </Form.Item>

              <Form.Item label="Taille de police" style={{ minWidth: 150 }}>
                <Select
                  value={options.fontSize}
                  onChange={(value) => handleChange('fontSize', value)}
                  options={fontSizes}
                />
              </Form.Item>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>Mise en page</Title>
            <Form.Item label="Espacement" style={{ maxWidth: 200 }}>
              <Select
                value={options.spacing}
                onChange={(value) => handleChange('spacing', value)}
                options={spacingOptions}
              />
            </Form.Item>
          </div>
        </Space>
      </Form>
    </div>
  );
};

export default CustomizationForm; 