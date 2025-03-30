import { Interval, RecurrenceType } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { dateSchemaWithMinDate } from '@/lib/dates/date-schema-with-min-date/date-schema-with-min-date';

export const getAddIncomeFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z
    .object({
      value: z.coerce.number().positive(t('valueField.error')),
      name: z.string().min(1, t('nameField.error')),
      date: dateSchemaWithMinDate({ message: t('dateField.error') }),
      recurrence: z.enum([
        RecurrenceType.ONE_TIME,
        RecurrenceType.INFINITE,
        RecurrenceType.MULTIPLE
      ]),
      repeatCount: z.number().int().positive().optional(),
      repeatEvery: z
        .enum([
          Interval.DAY,
          Interval.WEEK,
          Interval.TWO_WEEKS,
          Interval.MONTH,
          Interval.TWO_MONTHS,
          Interval.QUARTER,
          Interval.YEAR
        ])
        .optional(),
      category: z.string().min(1, t('categoryField.error'))
    })
    .superRefine((data, ctx) => {
      if (data.recurrence === RecurrenceType.INFINITE && !data.repeatEvery) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('repeatEveryField.error'),
          path: ['repeatEvery']
        });
      }
      if (data.recurrence === RecurrenceType.MULTIPLE) {
        if (!data.repeatCount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('repeatCountField.error'),
            path: ['repeatCount']
          });
        }

        if (!data.repeatEvery) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('repeatEveryField.error'),
            path: ['repeatEvery']
          });
        }
      }
    });
