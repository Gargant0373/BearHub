// Person data structure
interface Person {
  password?: String;
  admin?: Boolean;
  small_beers: number;
  big_beers: number;
  beef_jerky: number;
}

// Stats data structure
interface Stat {
  small_beers: number;
  big_beers: number;
  beef_jerky: number;
}

// Log data structure
interface Log {
  name: String;
  action: String;
  extra?: String | number;
  success?: boolean;
  handler?: String;
  timestamp?: number;
}

// Beer data structure
interface Beer {
  small_beers: number;
  big_beers: number;
  beef_jerky: number;
  to_pay: number;
}

export { Beer, Log, Stat, Person };
