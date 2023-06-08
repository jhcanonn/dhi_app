import Image from 'next/image';
import { CalendarHeaderProps } from '@models';
import { useMultipleCalendarContext } from '@contexts';
import { MultipleCalendarMode } from '@utils';

const CalendarHeader = ({
  avatar,
  name,
  mobile,
  color,
}: CalendarHeaderProps) => {
  const { mode } = useMultipleCalendarContext();

  const avatarSize = 40;
  const isDefault = mode === MultipleCalendarMode.DEFAULT;

  return (
    <div
      style={{
        border: isDefault ? '1px solid lightgray' : '',
        padding: isDefault ? '1rem' : '0.5rem',
      }}
      className="calendar-custom-header flex gap-3 min-w-[300px] bg-[var(--surface-card)]"
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={name!}
          width={avatarSize}
          height={avatarSize}
          className="object-contain"
        />
      ) : (
        <div
          style={{
            backgroundColor: color ?? '#007bff',
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
          }}
          className={`rounded-[50%] flex items-center justify-center text-white text-xl`}
        >
          <span>{name.slice(0, 1)}</span>
        </div>
      )}
      <section className="flex flex-col items-start justify-center">
        <h2 className="font-bold">{name}</h2>
        <h3>{mobile}</h3>
      </section>
    </div>
  );
};

export default CalendarHeader;
