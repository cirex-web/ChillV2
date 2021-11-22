import { useEffect, useState } from "react";

const getReadableTimeString = (time) => {
  if (isNaN(time)) {
    return "NaN";
  }
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
const useTimer = (endTime) => {
  const [timer, setTimer] = useState(endTime - new Date());
  
  useEffect(() => {
    if (endTime && (!timer|| timer >= 0)) {
      setTimeout(() => {
        setTimer(endTime - new Date());
      }, 100);
    }
  }, [timer, setTimer, endTime]);
  useEffect(() => {
    return () => {
      setTimer(0);
    };
  }, []);
  return {
    timer,
    timerString: getReadableTimeString(timer),
  };
};

export default useTimer;
