import {isFutureEvent} from '../utils';

const eventsToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events.filter((event) => isFutureEvent(event.time.start)).length,
  past: (events) => events.filter((event) => !isFutureEvent(event.time.start)).length
};

export const generateFilter = (events) =>
  Object.entries(eventsToFilterMap).map(([name, countEvents]) => {
    return {
      name,
      count: countEvents(events)
    };
  });