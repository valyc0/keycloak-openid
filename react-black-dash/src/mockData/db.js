// Gateway related mock data
export const gatewayTypes = ['4G', '5G', 'WiFi', 'Ethernet'];
export const gatewayStatuses = ['Online', 'Offline', 'Maintenance'];

// Mock sites data
export const mockSites = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Site ${i + 1}`,
  address: `${i + 100} Main Street`,
  city: `City ${i + 1}`,
  country: 'USA'
}));

// Mock meters data
export const meterTypes = ['Electric', 'Water', 'Gas', 'Temperature'];

export const mockMeters = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Meter ${i + 1}`,
  type: meterTypes[Math.floor(Math.random() * meterTypes.length)],
  model: `Model-${Math.floor(Math.random() * 5) + 1}`,
  serialNumber: `MTR${String(i + 1).padStart(5, '0')}`
}));

export const METER_PARAMETERS = [
  {
    id: 'interval',
    name: 'Reading Interval (minutes)',
    type: 'number',
    required: true,
    min: 1,
    max: 60,
    value: '15'  // Default value
  },
  {
    id: 'protocol',
    name: 'Communication Protocol',
    type: 'string',
    required: true,
    value: 'MODBUS'  // Default value
  },
  {
    id: 'port',
    name: 'Port Number',
    type: 'number',
    required: true,
    min: 1,
    max: 65535,
    value: '502'  // Default value
  },
  {
    id: 'password',
    name: 'Device Password',
    type: 'string',
    required: false,
    value: ''  // Default empty
  }
];

// Mock gateways data
export const mockGateways = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Gateway ${i + 1}`,
  serial: `GW${String(i + 1).padStart(5, '0')}`,
  type: gatewayTypes[Math.floor(Math.random() * gatewayTypes.length)],
  status: gatewayStatuses[Math.floor(Math.random() * gatewayStatuses.length)]
}));

// Alarm related mock data
export const alarmOptions = {
  callTypes: ['Incoming', 'Outgoing', 'Missed'],
  carriers: ['Verizon', 'AT&T', 'T-Mobile', 'Sprint'],
  statuses: ['Completed', 'Failed', 'In Progress']
};

// Helper function to generate random data
const generateRandomPhone = () => {
  return `+${Math.floor(Math.random() * 9000000000) + 1000000000}`;
};

const generateRandomTimestamp = () => {
  const start = new Date('2025-02-21T00:00:00Z').getTime();
  const end = new Date('2025-02-21T23:59:59Z').getTime();
  const timestamp = new Date(start + Math.random() * (end - start));
  return timestamp.toISOString();
};

// Mock alarms data
export const mockAlarms = Array.from({ length: 100 }, (_, i) => {
  const callType = alarmOptions.callTypes[Math.floor(Math.random() * alarmOptions.callTypes.length)];
  const isMissed = callType === 'Missed';
  
  return {
    id: i + 1,
    caller_number: generateRandomPhone(),
    callee_number: generateRandomPhone(),
    call_type: callType,
    carrier: alarmOptions.carriers[Math.floor(Math.random() * alarmOptions.carriers.length)],
    duration_seconds: isMissed ? 0 : Math.floor(Math.random() * 3600), // Max 1 hour
    charge_amount: isMissed ? 0 : Number((Math.random() * 10).toFixed(2)), // Max $10
    status: isMissed ? 'Failed' : alarmOptions.statuses[Math.floor(Math.random() * alarmOptions.statuses.length)],
    timestamp: generateRandomTimestamp()
  };
});

// Mock dashboard stats
export const getDashboardStats = () => ({
  totalAlarms: mockAlarms.length,
  completedAlarms: mockAlarms.filter(a => a.status === 'Completed').length,
  failedAlarms: mockAlarms.filter(a => a.status === 'Failed').length,
  inProgressAlarms: mockAlarms.filter(a => a.status === 'In Progress').length,
  chargeTotal: mockAlarms.reduce((sum, alarm) => sum + alarm.charge_amount, 0).toFixed(2)
});