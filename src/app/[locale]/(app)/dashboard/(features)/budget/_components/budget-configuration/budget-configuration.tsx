import { useParams } from 'next/navigation';

import { AddIncomeDialog } from './_components/income/add-income/add-income-dialog';
import { IncomesList } from './_components/income/incomes-list';
import { AddOutcomeDialog } from './_components/outcome/add-outcome/add-outcome-dialog';
import { OutcomesList } from './_components/outcome/outcomes-list';
import { AddPouchDialog } from './_components/pouch/add-pouch/add-pouch-dialog';
import { PouchList } from './_components/pouch/pouch-list';
import { ShowPastItemsSwitch } from './_components/show-past-items-switch';

export const BudgetConfiguration = ({
  shouldShowPastItems
}: {
  shouldShowPastItems: boolean;
}) => {
  return (
    <>
      <div className='my-6 flex flex-col items-end gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <ShowPastItemsSwitch shouldShowPastItems={shouldShowPastItems} />
        <div className='-order-1 grid w-full grid-cols-3 items-center gap-2 md:flex md:justify-end lg:order-none'>
          <AddIncomeDialog />
          <AddOutcomeDialog />
          <AddPouchDialog />
        </div>
      </div>
      <section className='grid grid-cols-1 gap-8 2xl:grid-cols-3'>
        <IncomesList shouldShowPastItems={shouldShowPastItems} />
        <OutcomesList shouldShowPastItems={shouldShowPastItems} />
        <PouchList shouldShowPastItems={shouldShowPastItems} />
      </section>
    </>
  );
};
