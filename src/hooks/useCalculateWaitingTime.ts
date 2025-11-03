import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

// Type
interface WaitingTimeResult {
  diffInText: string;
  diffInMinutes: number;
}

function useCalculateWaitingTime() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const calculateWaitingTime = (
    createdAt: string | Date,
  ): WaitingTimeResult => {
    const orderTime = dayjs(createdAt);
    const diffInMinutes = now.diff(orderTime, 'minute');

    if (diffInMinutes < 60) {
      return {
        diffInText: diffInMinutes > 0 ? `${diffInMinutes} 分` : '剛剛',
        diffInMinutes: diffInMinutes,
      };
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      return {
        diffInText: minutes > 0 ? `${hours} 時 ${minutes} 分` : `${hours} 時`,
        diffInMinutes: diffInMinutes,
      };
    }
  };

  return calculateWaitingTime;
}
export default useCalculateWaitingTime;
