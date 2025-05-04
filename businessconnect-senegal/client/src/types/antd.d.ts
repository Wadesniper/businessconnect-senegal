import { ReactNode } from 'react';

declare module 'antd' {
  export interface ButtonProps {
    children?: ReactNode;
    type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
    size?: 'large' | 'middle' | 'small';
    htmlType?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    loading?: boolean | { delay: number };
    disabled?: boolean;
    icon?: ReactNode;
    block?: boolean;
  }

  export interface TagProps {
    children?: ReactNode;
    color?: string;
    closable?: boolean;
    onClose?: () => void;
  }

  export interface SelectProps {
    children?: ReactNode;
    value?: string | string[];
    defaultValue?: string | string[];
    mode?: 'multiple' | 'tags';
    placeholder?: string;
    onChange?: (value: any) => void;
    style?: React.CSSProperties;
    allowClear?: boolean;
  }

  export interface SelectOptionProps {
    children?: ReactNode;
    value: string | number;
    disabled?: boolean;
  }

  export interface FormProps {
    children?: ReactNode;
    form?: any;
    onFinish?: (values: any) => void;
    layout?: 'horizontal' | 'vertical' | 'inline';
  }

  export interface FormItemProps {
    children?: ReactNode;
    name?: string;
    label?: ReactNode;
    rules?: any[];
  }

  export interface InputProps {
    id?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    prefix?: ReactNode;
    suffix?: ReactNode;
    type?: string;
  }

  export interface ModalProps {
    children?: ReactNode;
    title?: ReactNode;
    visible?: boolean;
    onOk?: () => void;
    onCancel?: () => void;
    footer?: ReactNode | null;
    width?: number | string;
  }

  export interface RowProps {
    children?: ReactNode;
    gutter?: number | [number, number];
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
    align?: 'top' | 'middle' | 'bottom';
  }

  export interface ColProps {
    children?: ReactNode;
    span?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  }

  export interface SpinProps {
    children?: ReactNode;
    spinning?: boolean;
    size?: 'small' | 'default' | 'large';
    tip?: string;
  }

  export interface ResultProps {
    children?: ReactNode;
    status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';
    title?: ReactNode;
    subTitle?: ReactNode;
    extra?: ReactNode[];
  }

  export interface CardProps {
    children?: ReactNode;
    title?: ReactNode;
    extra?: ReactNode;
    bordered?: boolean;
    hoverable?: boolean;
  }

  export interface ListProps<T> {
    children?: ReactNode;
    dataSource?: T[];
    renderItem?: (item: T) => ReactNode;
    loading?: boolean;
  }

  export interface TypographyProps {
    children?: ReactNode;
    level?: 1 | 2 | 3 | 4 | 5;
    type?: 'secondary' | 'success' | 'warning' | 'danger';
  }

  export interface MessageConfig {
    top?: number;
    duration?: number;
    maxCount?: number;
    rtl?: boolean;
  }

  export interface MessageInstance {
    success: (content: ReactNode, duration?: number, onClose?: () => void) => void;
    error: (content: ReactNode, duration?: number, onClose?: () => void) => void;
    info: (content: ReactNode, duration?: number, onClose?: () => void) => void;
    warning: (content: ReactNode, duration?: number, onClose?: () => void) => void;
    loading: (content: ReactNode, duration?: number, onClose?: () => void) => void;
  }

  export const Button: React.FC<ButtonProps>;
  export const Tag: React.FC<TagProps>;
  export const Select: React.FC<SelectProps> & { Option: React.FC<SelectOptionProps> };
  export const Form: React.FC<FormProps> & { Item: React.FC<FormItemProps> };
  export const Input: React.FC<InputProps> & { TextArea: React.FC<InputProps> };
  export const Modal: React.FC<ModalProps>;
  export const Row: React.FC<RowProps>;
  export const Col: React.FC<ColProps>;
  export const Spin: React.FC<SpinProps>;
  export const Result: React.FC<ResultProps>;
  export const Card: React.FC<CardProps>;
  export const List: React.FC<ListProps<any>>;
  export const Typography: React.FC<TypographyProps>;
  export const message: MessageInstance;
} 