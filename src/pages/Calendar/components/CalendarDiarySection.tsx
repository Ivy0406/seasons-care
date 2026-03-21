import DairyCard from '@/components/common/DairyCard';

import mockDiaryCards from '../mockDiaryCards';

function CalendarDiarySection() {
  return (
    <section className="flex w-full flex-col gap-5">
      {mockDiaryCards.map((item) => (
        <DairyCard key={item.id} item={item} />
      ))}
    </section>
  );
}

export default CalendarDiarySection;
