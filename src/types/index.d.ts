export type CalendarEvent = {
  id: string;

  index: number;

  date: string;
  labels: EventLabel[];

  name: string;
};

export type EventLabel = {
  id: string;
  name: string;
  color: string;
};
