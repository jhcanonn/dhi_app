import { FilterBar } from '@components';

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="grow flex flex-col">
      <FilterBar />
      {children}
    </section>
  );
};

export default CalendarLayout;
