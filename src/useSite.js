import { useEffect, useState } from "react";
import useTimer from "./useTimer";

const colors = {
  Chilled: "var(--blue-color-5)",
  Unblocked: "var(--green-color-2)",
  Pending: "var(--blue-color-4)",
  "Awaiting Approval": "var(--blue-color-4)",
};
const priorities = {
  Chilled: 1,
  Unblocked: 2,
  Pending: 4,
  "Awaiting Approval": 3,
};
const useSite = (siteData) => {
  let url = siteData[0] ?? "Loading...";
  let { currently_blocked, date_blocked, request, reblock } = siteData[1] || {};

  const {timer,timerString} = useTimer(request?.end_time || reblock);

  const [status, setStatus] = useState("");
  useEffect(() => {
    if (currently_blocked) {
      if (request) {
        if (timer >= 0) {
          setStatus("Pending");
        } else {
          setStatus("Awaiting Approval");
        }
      } else {
        setStatus("Chilled");
      }
    } else {
      setStatus("Unblocked");
    }
  }, [timer, currently_blocked, request]);



  return {
    timer,
    timerStr: timerString,
    status,
    color: colors[status],
    priority: priorities[status],
    url,
    date_blocked,
  };
};
export default useSite;
