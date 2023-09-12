let consumption: number = 0;
let lastReset: Date = new Date();

let getConsumption = () => {
    return consumption;
}

let incrementMeter = (liters: number) => {
    consumption += liters;
    checkReset();
}

let checkReset = () => {
    let now = new Date();
    if (lastReset.getDay() != now.getDay()) {
        consumption = 0;
        lastReset = now;
    }
}

export { getConsumption, incrementMeter };