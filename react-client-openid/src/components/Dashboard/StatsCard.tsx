import React from 'react';
import { DashboardStats } from '../../types/models';

interface StatsCardProps {
  stats: DashboardStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Users',
      value: String(stats.totalUsers),
      icon: 'pe-7s-users',
      color: '4'
    }
  ];

  return (
    <div className="card h-100">
      <div className="card-body">
        <h4 className="card-title mb-4">Statistics Overview</h4>
        <div className="row g-2">
          {cards.map((card, index) => (
            <div key={index} className="col-12">
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
      </div>
    </div>
  );
};

export default StatsCard;
