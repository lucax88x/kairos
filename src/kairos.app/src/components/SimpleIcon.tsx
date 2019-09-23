import React from 'react';
import { SimpleIcons, SimpleIconsType } from 'simple-icons/icons';
import GithubIcon from 'simple-icons/icons/github';
import LinkedIn from 'simple-icons/icons/linkedin';

export interface SimpleIconProps {
  type: SimpleIconsType;
  className?: string;
  color?: string;
}

export const SimpleIcon: React.FC<SimpleIconProps> = props => {
  const { type, color, className } = props;

  let icon: SimpleIcons;
  switch (type) {
    default:
    case 'github':
      icon = GithubIcon;
      break;
    case 'linkedin':
      icon = LinkedIn;
      break;
  }

  if (!icon) return null;

  const iconColor = color ? color : `#${icon.hex}`;
  const style = {
    fill: 'currentColor',
  };

  return (
    <div
      className={className}
      style={{ ...style, color: iconColor }}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
    />
  );
};
