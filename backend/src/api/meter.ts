let consumption: number = 0;
let lastReset: Date = new Date();

let incrementMeter = (liters: number) => {
    consumption += liters;
}

let checkReset = () => {
    let now = new Date();
    if (lastReset.getDay() != now.getDay()) {
        consumption = 0;
        lastReset = now;
    }
}

export { consumption, incrementMeter };