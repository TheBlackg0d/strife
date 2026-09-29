import { Client, type IMessage } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { refreshTokenQuery } from "~/api/auth/auth.keys";

const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8085/ws";

export interface StompSession {
  client: Client;
}

export function useStomp() {
  const [session, setSession] = useState<StompSession | null>(null);

  const queryClient = useQueryClient();

  const authResponse = queryClient.getQueryData(refreshTokenQuery().queryKey);

  useEffect(() => {
    const client = new Client({
      brokerURL: WS_URL,
      beforeConnect: async () => {
        let token = authResponse?.accessToken;

        if (!token) {
          const data = await queryClient.query({
            ...refreshTokenQuery(),
            staleTime: 0,
          });
          token = data?.accessToken;
        }

        if (!token) {
          void client.deactivate();

          throw new Error("no session");
        }
        client.connectHeaders = {
          Authorization: `Bearer ${token}`,
        };
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setSession({ client });
      },
      onWebSocketClose: () => {
        setSession(null);
      },
      onStompError: (frame) => {
        console.warn("STOMP:", frame.headers.message);
      },
    });

    client.activate();

    return () => {
      setSession(null);
      void client.deactivate();
    };
  }, []);

  return session;
}

export function useSubscription<T>(
  session: StompSession | null,
  destination: string | null,
  onMessage: (payload: T) => void,
) {
  const handlerRef = useRef(onMessage);

  useEffect(() => {
    handlerRef.current = onMessage;
  });

  useEffect(() => {
    if (!session || !destination) return;

    const { client } = session;

    const sub = client.subscribe(destination, (frame: IMessage) => {
      handlerRef.current(JSON.parse(frame.body) as T);
    });

    return () => {
      if (client.connected) {
        sub.unsubscribe();
      }
    };
  }, [session, destination]);
}
