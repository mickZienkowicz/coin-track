import { AddIncomeDialog } from './_components/income/add-income/add-income-dialog';
import { IncomesList } from './_components/income/incomes-list';
import { AddOutcomeDialog } from './_components/outcome/add-outcome/add-outcome-dialog';
import { OutcomesList } from './_components/outcome/outcomes-list';
import { AddPouchDialog } from './_components/pouch/add-pouch/add-pouch-dialog';
import { PouchList } from './_components/pouch/pouch-list';

export const BudgetConfiguration = () => {
  return (
    <>
      <div className='my-6 grid w-full grid-cols-3 items-center gap-2 md:flex md:justify-end'>
        <AddIncomeDialog />
        <AddOutcomeDialog />
        <AddPouchDialog />
      </div>
      <section className='grid grid-cols-1 gap-8 2xl:grid-cols-3'>
        <IncomesList />
        <OutcomesList />
        <PouchList />
      </section>
    </>
  );
};
