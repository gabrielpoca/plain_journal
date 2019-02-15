import _ from 'lodash';
import { isSameDay, isSameWeek } from 'date-fns';

import database from '../db';

import { newID } from '../utils';

export const db = database;

const getComparisonFn = habit =>
  habit.type === 'daily' ? isSameDay : isSameWeek;

export const toggleHabit = habit => {
  const comparisonFn = getComparisonFn(habit);
  habit.entries = habit.entries || [];
  const today = new Date();
  const done = _.remove(habit.entries, entry => comparisonFn(entry, today));
  if (done.length === 0) habit.entries.push(new Date());
  return habit;
};

export const isDone = habit => {
  const comparisonFn = getComparisonFn(habit);
  const today = new Date();
  return !!_.find(habit.entries, entry => comparisonFn(entry, today));
};

export const newHabit = values => {
  return db.put({
    ...values,
    doc_type: 'habit',
    _id: `habit_${values.type}_${newID()}`,
  });
};
