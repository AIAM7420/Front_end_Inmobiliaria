import { useCallback, useEffect, useRef, useState } from 'react';
import { apiBaseUrl, expireSession } from '../axios.config';
import type { ChatClientFrame, ChatServerFrame } from '../types';

export type ChatStatus = 'desconectado' | 'conectando' | 'conectado';

/** One browser socket; the server supports multiple tabs for the same account. */
export function useChatWebSocket(
  token: string | null,
  onFrame: (frame: ChatServerFrame) => void,
  onAuthenticated: () => void,
) {
  const [status, setStatus] = useState<ChatStatus>('desconectado');
  const socketRef = useRef<WebSocket | null>(null);
  const authenticatedRef = useRef(false);
  const onFrameRef = useRef(onFrame);
  const onAuthenticatedRef = useRef(onAuthenticated);

  useEffect(() => {
    onFrameRef.current = onFrame;
    onAuthenticatedRef.current = onAuthenticated;
  }, [onFrame, onAuthenticated]);

  useEffect(() => {
    if (!token) {
      authenticatedRef.current = false;
      return;
    }

    let stopped = false;
    let attempt = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = () => {
      if (stopped) return;
      setStatus('conectando');
      authenticatedRef.current = false;

      const url = new URL(`${apiBaseUrl}/ws/chat`);
      url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        // Auth must be the first frame and reach FastAPI within five seconds.
        socket.send(JSON.stringify({ type: 'auth', access_token: token }));
      };

      socket.onmessage = ({ data }) => {
        let frame: ChatServerFrame;
        try {
          const parsed: unknown = JSON.parse(String(data));
          if (typeof parsed !== 'object' || parsed === null ||
              !('type' in parsed) || typeof parsed.type !== 'string') {
            socket.close(1002, 'invalid frame');
            return;
          }
          frame = parsed as ChatServerFrame;
        } catch {
          socket.close(1002, 'invalid frame');
          return;
        }
        if (frame.type === 'auth.ok') {
          authenticatedRef.current = true;
          attempt = 0;
          setStatus('conectado');
          // Each reconnect must fetch messages missed while the socket was down.
          onAuthenticatedRef.current();
        } else {
          onFrameRef.current(frame);
        }
      };

      socket.onerror = () => {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close();
        }
      };

      socket.onclose = ({ code }) => {
        if (socketRef.current === socket) socketRef.current = null;
        authenticatedRef.current = false;
        setStatus('desconectado');
        if (stopped) return;
        if (code === 1008) {
          expireSession();
          return;
        }
        const ceiling = Math.min(30_000, 1_000 * 2 ** Math.min(attempt++, 5));
        retryTimer = setTimeout(connect, ceiling * (0.5 + Math.random()));
      };
    };

    connect();
    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);
      socketRef.current?.close(1000, 'component unmounted');
      socketRef.current = null;
    };
  }, [token]);

  const send = useCallback((frame: ChatClientFrame): boolean => {
    const socket = socketRef.current;
    if (!authenticatedRef.current || socket?.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(frame));
    return true;
  }, []);

  return { status, send };
}
