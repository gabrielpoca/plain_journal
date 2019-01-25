import _ from 'lodash';
import { isSameDay, isSameWeek } from 'date-fns';
import PouchDB from 'pouchdb';

export const habits = new PouchDB('habits');

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

window.habits = habits;
