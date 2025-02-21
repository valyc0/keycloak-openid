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