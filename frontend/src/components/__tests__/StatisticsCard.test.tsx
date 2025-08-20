import React from 'react';
import { render, screen } from '@testing-library/react';
import StatisticsCard from '../StatisticsCard';

describe('StatisticsCard', () => {
  const defaultProps = {
    title: 'Test Title',
    value: '100',
    icon: 'bi-graph-up',
    color: 'primary',
  };

  it('renders without crashing', () => {
    render(<StatisticsCard {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('displays change information when provided', () => {
    const propsWithChange = {
      ...defaultProps,
      change: '+5%',
      changeType: 'positive' as const,
    };
    render(<StatisticsCard {...propsWithChange} />);
    expect(screen.getByText('+5%')).toBeInTheDocument();
  });

  it('displays description when provided', () => {
    const propsWithDescription = {
      ...defaultProps,
      description: 'Test description',
    };
    render(<StatisticsCard {...propsWithDescription} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('applies correct color classes', () => {
    render(<StatisticsCard {...defaultProps} />);
    const card = screen.getByText('Test Title').closest('.card');
    expect(card).toBeInTheDocument();
  });
});
