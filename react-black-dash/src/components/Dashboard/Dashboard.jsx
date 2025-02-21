import { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    generateRandomData();
  }, []);

  const generateRandomData = () => {
    const firstNames = ['John', 'Jane', 'Robert', 'Maria', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Emma'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const statuses = [
      { text: 'Completed', class: 'bg-success' },
      { text: 'Pending', class: 'bg-warning' },
      { text: 'Failed', class: 'bg-danger' }
    ];

    const newTransactions = Array.from({ length: 100 }, (_, i) => ({
      txId: `#TX-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      customer: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      date: new Date(2025, 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      amount: (Math.random() * 1000 + 100).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)]
    }));

    setTransactions(newTransactions);
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card widget-card primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-white-50">Total Users</p>
                  <h3 className="mb-0">1,294</h3>
                  <p className="mt-3 mb-0">
                    <span className="text-success"><i className="fas fa-arrow-up me-1"></i>3.48%</span>
                    <span className="text-white-50 ms-2">Since last month</span>
                  </p>
                </div>
                <i className="fas fa-users stats-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6">
          <div className="card widget-card info">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-white-50">Total Revenue</p>
                  <h3 className="mb-0">$75,648</h3>
                  <p className="mt-3 mb-0">
                    <span className="text-success"><i className="fas fa-arrow-up me-1"></i>11.7%</span>
                    <span className="text-white-50 ms-2">Since last month</span>
                  </p>
                </div>
                <i className="fas fa-chart-line stats-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6">
          <div className="card widget-card success">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-white-50">New Orders</p>
                  <h3 className="mb-0">576</h3>
                  <p className="mt-3 mb-0">
                    <span className="text-danger"><i className="fas fa-arrow-down me-1"></i>2.15%</span>
                    <span className="text-white-50 ms-2">Since last week</span>
                  </p>
                </div>
                <i className="fas fa-shopping-cart stats-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-sm-6">
          <div className="card widget-card warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-white-50">Total Sales</p>
                  <h3 className="mb-0">$36,294</h3>
                  <p className="mt-3 mb-0">
                    <span className="text-success"><i className="fas fa-arrow-up me-1"></i>8.25%</span>
                    <span className="text-white-50 ms-2">Since last quarter</span>
                  </p>
                </div>
                <i className="fas fa-dollar-sign stats-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Recent Transactions</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.txId}>
                    <td>{transaction.txId}</td>
                    <td>{transaction.customer}</td>
                    <td>{transaction.date}</td>
                    <td>${transaction.amount}</td>
                    <td><span className={`badge ${transaction.status.class}`}>{transaction.status.text}</span></td>
                    <td>
                      <button className="btn btn-link text-info p-0"><i className="fas fa-eye"></i></button>
                      <button className="btn btn-link text-warning p-0 ms-2"><i className="fas fa-edit"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;