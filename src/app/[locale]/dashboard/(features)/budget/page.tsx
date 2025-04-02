import { ListOrdered, PieChart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getBudget } from '@/server/budget/queries/get-budget';
import { getBudgetSummary } from '@/server/budget/queries/get-budget-summary';
import { getSelectedFamily } from '@/server/family/queries/get-selected-family';

import { NoFamilyCard } from '../../_components/no-family-card';
import { BudgetSettingsDialog } from './_components/budget-settings/budget-settings-dialog/budget-settings-dialog';
import { BudgetSummaryBadge } from './_components/budget-summary-badge/budget-summary-badge';
import { BudgetSummary } from './_components/budget-summary/budget-summary';
import { AddIncomeDialog } from './_components/income/add-income/add-income-dialog';
import { IncomesList } from './_components/income/incomes-list';
import { AddOutcomeDialog } from './_components/outcome/add-outcome/add-outcome-dialog';
import { OutcomesList } from './_components/outcome/outcomes-list';
import { AddPouchDialog } from './_components/pouch/add-pouch/add-pouch-dialog';
import { PouchList } from './_components/pouch/pouch-list';

export default async function BudgetPage() {
  const t = await getTranslations('budget');
  const budget = await getBudget();
  const family = await getSelectedFamily();
  const budgetSummary = await getBudgetSummary();

  return (
    <div className='@container'>
      <div className='@xl:flex-row flex flex-col items-center justify-between gap-4 2xl:mt-2'>
        <div className='@xl:flex-row flex w-full flex-col items-center justify-start gap-6'>
          <h1 className='@xl:w-auto w-full text-start text-3xl font-semibold'>
            {t('title')}
          </h1>
          <BudgetSummaryBadge
            balance={budgetSummary?.balance}
            currency={family?.currency}
          />
        </div>
        {budget && (
          <BudgetSettingsDialog budget={budget} className='@xl:w-auto w-full' />
        )}
      </div>

      {budget && family ? (
        <>
          <Tabs defaultValue='summary' className='w-full gap-0'>
            <TabsList className='mt-6 w-full'>
              <TabsTrigger value='summary'>
                <PieChart className='h-4 w-4' />
                {t('summary')}
              </TabsTrigger>
              <TabsTrigger value='budget-items'>
                <ListOrdered className='h-4 w-4' />
                {t('budgetItems')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='summary'>
              <BudgetSummary
                budgetSummary={budgetSummary}
                currency={family.currency}
              />
            </TabsContent>
            <TabsContent value='budget-items'>
              <div className='my-6 grid w-full items-center gap-2 md:flex md:justify-end'>
                <AddIncomeDialog currency={family.currency} />
                <AddOutcomeDialog currency={family.currency} />
                <AddPouchDialog currency={family.currency} />
              </div>
              <section className='grid grid-cols-1 gap-8 2xl:grid-cols-3'>
                <IncomesList currency={family.currency} />
                <OutcomesList currency={family.currency} />
                <PouchList currency={family.currency} />
              </section>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <NoFamilyCard />
      )}
    </div>
  );
}
