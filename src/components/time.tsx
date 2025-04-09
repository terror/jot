import { Calendar, Timer } from 'lucide-react';

export const Time = () => {
  const date = new Date();

  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutes = date.getMinutes().toString().padStart(2, '0');

  return (
    <div className='flex'>
      <div className='flex items-center gap-x-1'>
        <Calendar className='h-3 w-3' />
        <p>
          {dayOfWeek} {month}.{day}
        </p>
      </div>
      <p className='px-2'>|</p>
      <div className='flex items-center gap-x-1'>
        <Timer className='h-3 w-3' />
        <p>
          {hours}:{minutes} {ampm}
        </p>
      </div>
    </div>
  );
};
