import { getFortuneSummary } from '@/server/fortune/queries/get-forune-summary';

import { FortuneSummarySection } from '../../../_components/fortune-summary-section';

export const FortuneSummaryCard = async () => {
  const fortuneSummary = await getFortuneSummary();

  return <FortuneSummarySection fortuneSummary={fortuneSummary} />;
};
