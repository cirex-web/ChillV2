import { useEffect, useState } from "react";
const getReadableTimeString = (time) => {
  if (time < 0) {
    return "0:00";
  }
  time /= 1000;
  time |= 0;
  let s = (time % 60) + "";
  time = time / 60;
  time |= 0;
  let m = (time % 60) + "";
  time /= 60;
  time |= 0;
  let h = (time % 24) + "";
  if (h !== "0") {
    return h + ":" + m.padStart(2, "0") + ":" + s.padStart(2, "0");
  } else {
    return m + ":" + s.padStart(2, "0");
  }
};
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

  let url = siteData[0]?.replace("https://","");
  let { currently_blocked, date_blocked, request, reblock } = siteData[1] || {};
  url = url ?? "Loading...";

  const time = request?.end_time || reblock;
  const [timer, setTimer] = useState(time - new Date());
  const [status, setStatus] = useState("Loading...");
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

  useEffect(() => {
    if (timer && timer >= 0) {
      setTimeout(() => {
        setTimer(time - new Date());
      }, 100);
    } else if (time && time - new Date() >= 0) {
      setTimer(time - new Date());
    } else {
      setTimer(NaN);
    }
  }, [timer, setTimer, time]);
  useEffect(() => {
    return () => {
      setTimer(0);
    };
  }, []);
  return {
    timer,
    timerStr: getReadableTimeString(timer),
    status,
    color: colors[status],
    priority: priorities[status],
    url,
    date_blocked
  };
};
export default useSite;
