import { v4 } from 'uuid';
import create from 'zustand';

type EventLog = {
  id: string;
  message: string;
  createdAt: Date;
};

type EventLogStore = {
  eventLogs: EventLog[];
  addEventLog: (message: string) => void;
  resetEventLogs: () => void;
};

function getTimeXMsAgo(x: number) {
  const now = new Date();
  return new Date(now.getTime() - x);
}

const DEFAULT_EVENT_LOGS: EventLog[] = [
  {
    id: '123123123123123asdafas123',
    message: 'Game started!',
    createdAt: getTimeXMsAgo(3),
  },
  {
    id: 'asdasdasdasasdaddasdasd123',
    message: 'Move around by clicking the spaces next to you.',
    createdAt: getTimeXMsAgo(2),
  },
  {
    id: '12312312312345gfdsdgs123',
    message: 'Find the Gambit to win!',
    createdAt: getTimeXMsAgo(1),
  },
];

export const useEventLogStore = create<EventLogStore>((set) => ({
  eventLogs: [],
  resetEventLogs: () => {
    set(() => ({
      eventLogs: [...DEFAULT_EVENT_LOGS],
    }));
  },
  addEventLog: (message: string) => {
    set((state) => ({
      eventLogs: [
        ...state.eventLogs,
        {
          message,
          createdAt: new Date(),
          id: v4(),
        },
      ],
    }));
  },
}));
