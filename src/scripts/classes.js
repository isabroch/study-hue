class LightLabel {
  constructor(name, xy) {
    this.name = name;
    this.xy = xy;
  }
}

class Period {
  constructor(name, days, timeStart, timeEnd, label) {
    this.name = name;
    this.days = [...days];
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.label = label;
  }
}

export { LightLabel, Period };
