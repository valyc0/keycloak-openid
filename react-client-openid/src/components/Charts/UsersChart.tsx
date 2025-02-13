import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface UsersChartProps {
  users: Array<{role: string}>;
}

const UsersChart = ({ users }: UsersChartProps) => {
  // Count admins and regular users
  const adminCount = users.filter(user => user.role === 'Admin').length;
  const userCount = users.filter(user => user.role === 'User').length;

  const data: ChartData<'doughnut'> = {
    labels: ['Admin', 'User'],
    datasets: [
      {
        data: [adminCount, userCount],
        backgroundColor: [
          'rgba(0, 194, 146, 0.9)',
          'rgba(0, 194, 146, 0.5)',
        ],
        borderColor: [
          'rgba(0, 194, 146, 1)',
          'rgba(0, 194, 146, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Montserrat'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = adminCount + userCount;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        titleFont: {
          family: 'Montserrat',
          size: 12
        },
        bodyFont: {
          family: 'Montserrat'
        },
        backgroundColor: 'rgba(255,255,255,0.8)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 3,
      }
    },
  };

  return (
    <div className="card h-100">
      <div className="card-header py-2">
        <strong className="card-title">User Roles Distribution</strong>
      </div>
      <div className="card-body p-2">
        <div style={{ height: '140px', position: 'relative' }}>
          <Doughnut data={data} options={options} />
        </div>
        <div className="chart-info mt-1">
          <div className="d-flex justify-content-around">
            <div className="text-center">
              <div className="h5 mb-0">{adminCount} Admins</div>
            </div>
            <div className="text-center">
              <div className="h5 mb-0">{userCount} Users</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersChart;
