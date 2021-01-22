import {isFutureEvent} from '../utils/trip';

const eventsToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events.filter((tripEvent) => isFutureEvent(tripEvent.time.start)).length,
  past: (events) => events.filter((tripEvent) => !isFutureEvent(tripEvent.time.start)).length
};

export const generateFilter = (events) =>
  Object.entries(eventsToFilterMap).map(([name, countEvents]) => {
    return {
      name,
      count: countEvents(events)
    };
  });
