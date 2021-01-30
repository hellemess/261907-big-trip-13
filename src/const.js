export const DESTINATIONS = [
  `Acre`,
  `Bat Yam`,
  `Beersheba`,
  `Bnei Brak`,
  `Eilat`,
  `Haifa`,
  `Jerusalem`,
  `Kfar Saba`,
  `Netanya`,
  `Tel Aviv`
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`
};

export const OPTIONS = [
  {
    alias: `uber`,
    title: `Order Uber`,
    cost: 20,
    forTypes: [
    `Taxi`
    ]
  },
  {
    alias: `luggage`,
    title: `Add luggage`,
    cost: 30,
    forTypes: [
    `Flight`
    ]
  },
  {
    alias: `comfort`,
    title: `Switch to comfort class`,
    cost: 100,
    forTypes: [
    `Flight`
    ]
  },
  {
    alias: `meal`,
    title: `Add meal`,
    cost: 15,
    forTypes: [
    `Flight`
    ]
  },
  {
    alias: `seats`,
    title: `Choose seats`,
    cost: 5,
    forTypes: [
    `Flight`
    ]
  },
  {
    alias: `train`,
    title: `Travel by train`,
    cost: 40,
    forTypes: [
    `Flight`
    ]
  },
  {
    alias: `car`,
    title: `Rent a car`,
    cost: 200,
    forTypes: [
    `Drive`
    ]
  },
  {
    alias: `breakfast`,
    title: `Add breakfast`,
    cost: 50,
    forTypes: [
    `Check-in`
    ]
  },
  {
    alias: `tickets`,
    title: `Book tickets`,
    cost: 40,
    forTypes: [
    `Sightseeing`
    ]
  },
  {
    alias: `lunch`,
    title: `Lunch in city`,
    cost: 30,
    forTypes: [
    `Sightseeing`
    ]
  }
];

export const SortTypes = {
  DATE: `date`,
  PRICE: `price`,
  TIME: `time`
};

export const TYPES_IN = [
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

export const TYPES_TO = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`
];

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  LOAD: `LOAD`
};
