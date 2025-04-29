import React from 'react';
import { Form, Select, ColorPicker, Typography } from 'antd';
import { CustomizationOptions } from '../types';

const { Title } = Typography;

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
}

const fontFamilies = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
];

const fontSizes = [
  { label: 'Petit', value: '12px' },
  { label: 'Normal', value: '14px' },
  { label: 'Grand', value: '16px' },
];

const spacingOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Confortable', value: 'comfortable' },
  { label: 'Spacieux', value: 'spacious' },
];

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ options, onChange }) => {
  const handleChange = (field: keyof CustomizationOptions, value: any) => {
    onChange({
      ...options,
      [field]: value,
    });
  };

  return (
    <div>
      <Title level={4}>Personnalisation</Title>
      <Form layout="vertical">
        <Form.Item label="Couleur principale">
          <ColorPicker
            value={options.primaryColor}
            onChange={(color) => handleChange('primaryColor', color.toHexString())}
          />
        </Form.Item>

        <Form.Item label="Couleur secondaire">
          <ColorPicker
            value={options.secondaryColor}
            onChange={(color) => handleChange('secondaryColor', color.toHexString())}
          />
        </Form.Item>

        <Form.Item label="Police">
          <Select
            value={options.fontFamily}
            onChange={(value) => handleChange('fontFamily', value)}
            options={fontFamilies}
          />
        </Form.Item>

        <Form.Item label="Taille de police">
          <Select
            value={options.fontSize}
            onChange={(value) => handleChange('fontSize', value)}
            options={fontSizes}
          />
        </Form.Item>

        <Form.Item label="Espacement">
          <Select
            value={options.spacing}
            onChange={(value) => handleChange('spacing', value)}
            options={spacingOptions}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomizationPanel; 