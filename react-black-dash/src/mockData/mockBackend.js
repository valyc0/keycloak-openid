// Mock data for options
const callTypes = ['Incoming', 'Outgoing', 'Missed'];
const carriers = ['Verizon', 'AT&T', 'T-Mobile', 'Sprint'];
const statuses = ['Completed', 'Failed', 'In Progress'];
const gatewayTypes = ['4G', '5G', 'WiFi', 'Ethernet'];
const gatewayStatuses = ['Online', 'Offline', 'Maintenance'];
const meterTypes = ['Electric', 'Water', 'Gas', 'Temperature'];

// Mock data for gateways and related entities
const mockGateways = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Gateway ${i + 1}`,
  serial: `GW${String(i + 1).padStart(5, '0')}`,
  type: gatewayTypes[Math.floor(Math.random() * gatewayTypes.length)],
  status: gatewayStatuses[Math.floor(Math.random() * gatewayStatuses.length)]
}));

const mockSites = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Site ${i + 1}`,
  address: `${i + 100} Main Street`,
  city: `City ${i + 1}`,
  country: 'USA'
}));

const mockMeters = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Meter ${i + 1}`,
  type: meterTypes[Math.floor(Math.random() * meterTypes.length)],
  model: `Model-${Math.floor(Math.random() * 5) + 1}`,
  serialNumber: `MTR${String(i + 1).padStart(5, '0')}`
}));

const METER_PARAMETERS = [
  { id: 'interval', name: 'Reading Interval (minutes)', type: 'number', required: true },
  { id: 'protocol', name: 'Communication Protocol', type: 'string', required: true },
  { id: 'port', name: 'Port Number', type: 'number', required: true },
  { id: 'password', name: 'Device Password', type: 'string', required: false }
];

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

// Mock data for alarms
const alarms = Array.from({ length: 100 }, (_, i) => {
  const callType = callTypes[Math.floor(Math.random() * callTypes.length)];
  const isMissed = callType === 'Missed';
  
  return {
    id: i + 1,
    caller_number: generateRandomPhone(),
    callee_number: generateRandomPhone(),
    call_type: callType,
    carrier: carriers[Math.floor(Math.random() * carriers.length)],
    duration_seconds: isMissed ? 0 : Math.floor(Math.random() * 3600), // Max 1 hour
    charge_amount: isMissed ? 0 : Number((Math.random() * 10).toFixed(2)), // Max $10
    status: isMissed ? 'Failed' : statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: generateRandomTimestamp()
  };
});

// Helper function to generate ID
const generateId = () => Math.max(...alarms.map(alarm => alarm.id)) + 1;

// Helper function to simulate network delay
const delay = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 300);
  });
};

// Mock backend functions
export const mockBackend = {
  // Gateway related functions
  getGateways: ({ query = '', page = 1, pageSize = 10, sortBy = 'name', sortOrder = 'asc' }) => {
    if (!query || query.length < 3) {
      return delay({ data: [], total: 0, page, pageSize });
    }
    
    let filteredGateways = mockGateways.filter(gateway =>
      gateway.name.toLowerCase().includes(query.toLowerCase()) ||
      gateway.serial.toLowerCase().includes(query.toLowerCase())
    );

    // Apply sorting
    filteredGateways.sort((a, b) => {
      if (typeof a[sortBy] === 'string') {
        const compareResult = a[sortBy].localeCompare(b[sortBy]);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      }
      return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    });

    // Apply pagination
    const start = (page - 1) * pageSize;
    const paginatedGateways = filteredGateways.slice(start, start + pageSize);
    
    return delay({
      data: paginatedGateways,
      total: filteredGateways.length,
      page,
      pageSize
    });
  },

  getSites: () => delay({ data: mockSites }),

  getMeters: () => delay({ data: mockMeters }),

  getMeterParameters: () => delay({ data: METER_PARAMETERS }),

  validateGatewayParameters: async (params) => {
    const errors = {};
    Object.entries(params).forEach(([meterId, parameters]) => {
      parameters.forEach(param => {
        if (param.required && (!param.value || param.value.trim() === '')) {
          if (!errors[meterId]) errors[meterId] = {};
          errors[meterId][param.id] = 'This field is required';
        }
        if (param.type === 'number' && param.value && isNaN(param.value)) {
          if (!errors[meterId]) errors[meterId] = {};
          errors[meterId][param.id] = 'Must be a number';
        }
      });
    });
    return delay({ data: errors });
  },

  saveGatewayConfiguration: async (config) => {
    // In a real implementation, this would save to a backend
    console.log('Saving gateway configuration:', config);
    return delay({ data: { success: true, message: 'Configuration saved successfully' }});
  },

  // Alarm related functions
  // Get paginated alarms with sorting and filtering
  getAlarms: ({ page = 1, pageSize = 10, sortBy = 'id', sortOrder = 'asc', ...filters }) => {
    let filteredAlarms = [...alarms];

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filteredAlarms = filteredAlarms.filter(alarm => 
          String(alarm[key]).toLowerCase().includes(String(filters[key]).toLowerCase())
        );
      }
    });

    // Apply sorting
    filteredAlarms.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return sortOrder === 'asc' ? 1 : -1;
      if (bValue === null || bValue === undefined) return sortOrder === 'asc' ? -1 : 1;

      try {
        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        if (sortBy === 'timestamp') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
        }
        
        // Default string comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        if (aString === bString) return 0;
        const comparison = aString.localeCompare(bString);
        return sortOrder === 'asc' ? comparison : -comparison;
      } catch (error) {
        console.error('Error during sort comparison:', error);
        return 0;
      }
    });

    // Apply pagination
    const start = (page - 1) * pageSize;
    const paginatedAlarms = filteredAlarms.slice(start, start + pageSize);

    return delay({
      data: paginatedAlarms,
      total: filteredAlarms.length,
      page,
      pageSize
    });
  },

  // Create new alarm
  createAlarm: async (alarmData) => {
    const newAlarm = {
      id: generateId(),
      ...alarmData,
      timestamp: new Date().toISOString()
    };
    alarms.push(newAlarm);
    return delay({ data: newAlarm });
  },

  // Update existing alarm
  updateAlarm: async (id, alarmData) => {
    const index = alarms.findIndex(alarm => alarm.id === parseInt(id));
    if (index === -1) throw new Error('Alarm not found');
    
    alarms[index] = {
      ...alarms[index],
      ...alarmData,
      id: parseInt(id)
    };
    return delay({ data: alarms[index] });
  },

  // Delete alarm
  deleteAlarm: async (id) => {
    const index = alarms.findIndex(alarm => alarm.id === parseInt(id));
    if (index === -1) throw new Error('Alarm not found');
    alarms.splice(index, 1);
    return delay({ data: null });
  },

  // Get call types
  getCallTypes: () => delay({ data: callTypes }),

  // Get carriers
  getCarriers: () => delay({ data: carriers }),

  // Get statuses
  getStatuses: () => delay({ data: statuses }),

  // Get suggestions for a field
  getSuggestions: ({ field, query, limit = 5 }) => {
    // Get unique values for the field that match the query
    const suggestions = [...new Set(
      alarms
        .map(alarm => alarm[field])
        .filter(value =>
          value &&
          String(value).toLowerCase().includes(String(query).toLowerCase())
        )
    )].slice(0, limit);

    return delay({ data: suggestions });
  }
};
