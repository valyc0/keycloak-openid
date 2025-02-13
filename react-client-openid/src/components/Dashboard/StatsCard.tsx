import React from 'react';
import { DashboardStats } from '../../types/models';

interface StatsCardProps {
  stats: DashboardStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Revenue',
      value: `$${stats.revenue}`,
      icon: 'pe-7s-cash',
      color: '1'
    },
    {
      title: 'Sales',
      value: String(stats.sales),
      icon: 'pe-7s-cart',
      color: '2'
    },
    {
      title: 'Templates',
      value: String(stats.templates),
      icon: 'pe-7s-browser',
      color: '3'
    },
    {
      title: 'Users',
      value: String(stats.totalUsers),
      icon: 'pe-7s-users',
      color: '4'
    }
  ];

  return (
    <div className="row g-2">
      {cards.map((card, index) => (
        <div key={index} className="col-lg-3 col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="stat-widget-five">
                <div className={`stat-icon dib flat-color-${card.color}`}>
                  <i className={card.icon}></i>
                </div>
                <div className="stat-content">
                  <div className="text-left dib">
                    <div className="stat-text">
                      <span>{card.value}</span>
                    </div>
                    <div className="stat-heading">{card.title}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
