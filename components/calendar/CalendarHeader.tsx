import Image from 'next/image';
import { DefaultRecourse } from '@aldabil/react-scheduler/types';

const CalendarHeader = ({ avatar, title, mobile }: DefaultRecourse) => {
  return (
    <article className={`flex gap-3`}>
      <Image
        src={avatar!}
        alt={title!}
        width={30}
        height={30}
        className="object-contain"
      />
      <section className="flex flex-col items-start">
        <h2>{title}</h2>
        <h3>{mobile}</h3>
      </section>
    </article>
  );
};

export default CalendarHeader;
