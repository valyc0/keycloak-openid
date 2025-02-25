export class Alarm {
  constructor({
    id = null,
    caller_number = '',
    callee_number = '',
    call_type = '',
    carrier = '',
    duration_seconds = 0,
    charge_amount = 0.0,
    status = '',
    timestamp = null
  } = {}) {
    this.id = id;
    this.caller_number = caller_number;
    this.callee_number = callee_number;
    this.call_type = call_type;
    this.carrier = carrier;
    this.duration_seconds = duration_seconds;
    this.charge_amount = charge_amount;
    this.status = status;
    this.timestamp = timestamp;
  }

  static fromJson(json) {
    return new Alarm(json);
  }

  toJson() {
    return {
      id: this.id,
      caller_number: this.caller_number,
      callee_number: this.callee_number,
      call_type: this.call_type,
      carrier: this.carrier,
      duration_seconds: this.duration_seconds,
      charge_amount: this.charge_amount,
      status: this.status,
      timestamp: this.timestamp
    };
  }
}

export class Gateway {
  constructor({
    id = null,
    name = '',
    serial = '',
    type = '',
    status = ''
  } = {}) {
    this.id = id;
    this.name = name;
    this.serial = serial;
    this.type = type;
    this.status = status;
  }

  static fromJson(json) {
    return new Gateway(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      serial: this.serial,
      type: this.type,
      status: this.status
    };
  }
}

export class Site {
  constructor({
    id = null,
    name = '',
    address = '',
    city = '',
    country = ''
  } = {}) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.city = city;
    this.country = country;
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
      country: this.country
    };
  }
}

export class Meter {
  constructor({
    id = null,
    name = '',
    type = '',
    model = '',
    serialNumber = ''
  } = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.model = model;
    this.serialNumber = serialNumber;
  }

  static fromJson(json) {
    return new Meter(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      model: this.model,
      serialNumber: this.serialNumber
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