import PouchDB from 'pouchdb';

export const habits = new PouchDB('habits');

window.habits = habits;
