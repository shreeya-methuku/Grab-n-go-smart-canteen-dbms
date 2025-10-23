import React from 'react';

interface CardProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  description?: string;
  imageUrl?: string;
  layout?: 'vertical' | 'horizontal';
  // FIX: Add optional style prop to support inline styling, resolving type errors.
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = '', 
  onClick, 
  icon, 
  description, 
  imageUrl,
  layout = 'vertical',
  style
}) => {
  const isHorizontal = layout === 'horizontal';

  const cardContent = (
    <div 
      className={`bg-card rounded-xl shadow-md border border-border flex ${isHorizontal ? 'flex-row' : 'flex-col'} ${className}`}
      // FIX: Apply the style prop to the card's root element.
      style={style}
    >
      {imageUrl && (
        <div className={isHorizontal ? 'w-1/3 flex-shrink-0' : ''}>
          <img 
            src={imageUrl} 
            alt={title} 
            className={`object-cover ${isHorizontal ? 'w-full h-full rounded-l-xl' : 'w-full h-48 rounded-t-xl'}`} 
          />
        </div>
      )}
      <div className={`flex flex-col flex-grow ${isHorizontal ? '' : 'p-6'}`}>
        {!isHorizontal && (
          <div className="flex items-start mb-4">
            {icon && <div className="text-primary mr-4 mt-1 flex-shrink-0">{icon}</div>}
            <div className="flex-grow">
              {title && <h3 className="text-xl font-bold text-text-primary">{title}</h3>}
              {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
            </div>
          </div>
        )}
        {children ? (
          <div className="flex-grow flex flex-col">{children}</div>
        ) : (
          isHorizontal && (
            <div className="p-6">
              {title && <h3 className="text-xl font-bold text-text-primary">{title}</h3>}
              {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
            </div>
          )
        )}
      </div>
    </div>
  );

  return onClick ? (
    <div onClick={onClick} className="cursor-pointer h-full">
      {cardContent}
    </div>
  ) : (
    cardContent
  );
};
