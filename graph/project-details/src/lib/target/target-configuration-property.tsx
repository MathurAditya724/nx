import { JSX, ReactNode } from 'react';

interface RenderPropertyProps {
  data: string | Record<string, any> | any[];
  children?: ReactNode;
}

export function TargetConfigurationProperty({
  data,
  children,
}: RenderPropertyProps): JSX.Element | null {
  if (typeof data === 'string') {
    return (
      <span>
        {data}
        {children}
      </span>
    );
  } else if (Array.isArray(data)) {
    return (
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {String(item)}
            {children}
          </li>
        ))}
      </ul>
    );
  } else if (typeof data === 'object') {
    return (
      <ul>
        {Object.entries(data).map(([key, value], index) => (
          <li key={index}>
            <strong>{key}</strong>: {String(value)}
            {children}
          </li>
        ))}
      </ul>
    );
  } else {
    return null;
  }
}
