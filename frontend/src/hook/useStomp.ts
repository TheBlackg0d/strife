import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import { getAccessToken } from "@/auth/tokenStore";
import { refreshSession } from "@/auth/session";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8085/ws";

const DEACTIVATE_GRACE_MS = 1000;

interface Registration {
  destination: string;
  onMessage: (payload: unknown) => void;
  sub?: StompSubscription;
}

const registrations = new Set<Registration>();

let deactivateTimer: ReturnType<typeof setTimeout> | undefined;

export const stompClient: Client = new Client({
  brokerURL: WS_URL,
  beforeConnect: async () => {
    let token = getAccessToken();

    if (!token) {
      await refreshSession();
      token = getAccessToken();
    }

    if (!token) {
      void stompClient.deactivate();
      return;
    }

    stompClient.connectHeaders = {
      Authorization: `Bearer ${token}`,
    };
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
});

function openSubscription(registration: Registration) {
  registration.sub = stompClient.subscribe(
    registration.destination,
    (frame: IMessage) => {
      registration.onMessage(JSON.parse(frame.body));
    },
  );
}

stompClient.onConnect = () => {
  registrations.forEach(openSubscription);
};

stompClient.onWebSocketClose = () => {
  registrations.forEach((registration) => {
    registration.sub = undefined;
  });
};

stompClient.onStompError = (frame) => {
  console.error("STOMP error:", frame.headers["message"], frame.body);
};

export function subscibeToTopic<T>(
  destination: string,
  onMessage: (payload: T) => void,
): () => void {
  const registration: Registration = {
    destination,
    onMessage: onMessage as (payload: unknown) => void,
  };

  registrations.add(registration);

  if (deactivateTimer) {
    clearTimeout(deactivateTimer);
    deactivateTimer = undefined;
  }

  if (!stompClient.active) {
    void stompClient.activate();
  } else if (stompClient.connected) {
    openSubscription(registration);
  }

  return () => {
    if (!registrations.delete(registration)) {
      return;
    }

    if (stompClient.connected) {
      registration.sub?.unsubscribe();
    }
    registration.sub = undefined;

    if (registrations.size === 0 && !deactivateTimer) {
      deactivateTimer = setTimeout(() => {
        deactivateTimer = undefined;
        if (registrations.size === 0) {
          void stompClient.deactivate();
        }
      }, DEACTIVATE_GRACE_MS);
    }
  };
}

export function useSubscription<T>(
  destination: string | null,
  onMessage: (payload: T) => void,
) {
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  });

  useEffect(() => {
    if (!destination) return;

    return subscibeToTopic<T>(destination, (payload) =>
      handlerRef.current(payload),
    );
  }, [destination]);
}
