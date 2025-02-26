export class Alarm {
  constructor({
    id = null,
    gatewayId = '',
    gatewayName = '',
    type = '',
    severity = '',
    message = '',
    timestamp = null,
    status = '',
    callType = '',
    carrier = '',
    siteId = '',
    siteName = '',
    caller = '',
    caller_number = '',
    callee_number = '',
    duration_seconds = 0,
    charge_amount = 0.0
  } = {}) {
    this.id = id;
    this.gatewayId = gatewayId;
    this.gatewayName = gatewayName;
    this.type = type;
    this.severity = severity;
    this.message = message;
    this.timestamp = timestamp;
    this.status = status;
    this.callType = callType;
    this.carrier = carrier;
    this.siteId = siteId;
    this.siteName = siteName;
    this.caller = caller;
    this.caller_number = caller_number;
    this.callee_number = callee_number;
    this.duration_seconds = duration_seconds;
    this.charge_amount = charge_amount;
  }

  static fromJson(json) {
    return new Alarm(json);
  }

  toJson() {
    return {
      id: this.id,
      gatewayId: this.gatewayId,
      gatewayName: this.gatewayName,
      type: this.type,
      severity: this.severity,
      message: this.message,
      timestamp: this.timestamp,
      status: this.status,
      callType: this.callType,
      carrier: this.carrier,
      siteId: this.siteId,
      siteName: this.siteName,
      caller: this.caller,
      caller_number: this.caller_number,
      callee_number: this.callee_number,
      duration_seconds: this.duration_seconds,
      charge_amount: this.charge_amount
    };
  }
}

export class Gateway {
  constructor({
    id = null,
    name = '',
    serial = '',
    model = '',
    firmware = '',
    ip = '',
    status = '',
    siteId = '',
    siteName = '',
    lastConnection = null,
    isConfigured = false,
    callType = '',
    carrier = ''
  } = {}) {
    this.id = id;
    this.name = name;
    this.serial = serial;
    this.model = model;
    this.firmware = firmware;
    this.ip = ip;
    this.status = status;
    this.siteId = siteId;
    this.siteName = siteName;
    this.lastConnection = lastConnection;
    this.isConfigured = isConfigured;
    this.callType = callType;
    this.carrier = carrier;
  }

  static fromJson(json) {
    return new Gateway(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      serial: this.serial,
      model: this.model,
      firmware: this.firmware,
      ip: this.ip,
      status: this.status,
      siteId: this.siteId,
      siteName: this.siteName,
      lastConnection: this.lastConnection,
      isConfigured: this.isConfigured,
      callType: this.callType,
      carrier: this.carrier
    };
  }
}

export class Site {
  constructor({
    id = null,
    name = '',
    address = '',
    city = '',
    state = '',
    zipCode = '',
    country = '',
    latitude = null,
    longitude = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static fromJson(json) {
    return new Site(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
      latitude: this.latitude,
      longitude: this.longitude
    };
  }
}

export class Meter {
  constructor({
    id = null,
    name = '',
    type = '',
    protocol = '',
    manufacturer = ''
  } = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.protocol = protocol;
    this.manufacturer = manufacturer;
  }

  static fromJson(json) {
    return new Meter(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      protocol: this.protocol,
      manufacturer: this.manufacturer
    };
  }
}

export class MeterParameter {
  constructor({
    id = null,
    name = '',
    value = '',
    type = 'string',
    required = false,
    error = undefined
  } = {}) {
    this.id = id;
    this.name = name;
    this.value = value;
    this.type = type;
    this.required = required;
    this.error = error;
  }

  static fromJson(json) {
    return new MeterParameter(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      value: this.value,
      type: this.type,
      required: this.required,
      error: this.error
    };
  }
}