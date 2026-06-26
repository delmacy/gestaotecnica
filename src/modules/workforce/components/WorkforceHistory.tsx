import React from 'react';

type HistoryEvent = {
  id: string;
  eventType: string;
  payload: any;
  createdAt: Date;
};

export function WorkforceHistory({ events }: { events: HistoryEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-gray-500 italic">Nenhum evento registrado para este recurso.</p>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      {event.eventType}{' '}
                      <span className="font-medium text-gray-900">
                        {JSON.stringify(event.payload).substring(0, 100)}...
                      </span>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={event.createdAt.toISOString()}>
                      {event.createdAt.toLocaleString()}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
