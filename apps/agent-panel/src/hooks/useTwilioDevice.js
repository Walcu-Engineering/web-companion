import { useEffect, useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";

export function useTwilioDevice() {
  const BACKEND_URL = "http://localhost:4000/token";

  const [status, setStatus] = useState("idle");
  const callRef = useRef(null);
  const deviceRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const res = await fetch(BACKEND_URL);

      const { token } = await res.json();

      deviceRef.current = new Device(token, { logLevel: 1 });

      deviceRef.current.on("error", (err) => {
        console.error("Twilio Device error", err);
      });

      deviceRef.current.on("tokenWillExpire", async () => {
        try {
          const res = await fetch(BACKEND_URL);
          const { token: newToken } = await res.json();
          deviceRef.current.updateToken(newToken);
        } catch (e) {
          console.warn("No se pudo refrescar el token de Twilio", e);
        }
      });

      deviceRef.current.on("incoming", (call) => {
        callRef.current = call;
        setStatus("ringing");

        call.on("cancel", () => setStatus("idle"));
        call.on("disconnect", () => setStatus("idle"));
      });
      await deviceRef.current.register();
    }

    setup().catch(console.error);

    return () => {
      deviceRef.current?.destroy();
    };
  }, []);

  const accept = () => {
    callRef.current?.accept();
    setStatus("in-call");
  };
  const reject = () => {
    callRef.current?.reject();
    callRef.current = null;
    setStatus("idle");
  };
  const hangUp = () => {
    callRef.current?.disconnect();
    callRef.current = null;
    setStatus("idle");
  };

  return { status, accept, reject, hangUp };
}
