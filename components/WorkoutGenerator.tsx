import React, { useEffect, useMemo, useState } from 'react';
import { WORKOUT_LIBRARY } from '../constants';
import type { Workout } from '../types';
import { DumbbellIcon } from './Icons';

type WorkoutFocus = keyof typeof WORKOUT_LIBRARY;
type TrainingLevel = typeof WORKOUT_LIBRARY[WorkoutFocus]['plans'][number]['level'];

const formatTitle = (title: string) => title.replace(/\b\w/g, (char) => char.toUpperCase());

const WorkoutGenerator: React.FC = () => {
  const focusOptions = useMemo(() => Object.keys(WORKOUT_LIBRARY) as WorkoutFocus[], []);
  const [selectedFocus, setSelectedFocus] = useState<WorkoutFocus>('strength');
  const [selectedLevel, setSelectedLevel] = useState<TrainingLevel>(WORKOUT_LIBRARY.strength.plans[0].level);

  useEffect(() => {
    const defaultLevel = WORKOUT_LIBRARY[selectedFocus].plans[0].level;
    setSelectedLevel(defaultLevel);
  }, [selectedFocus]);

  const planOptions = WORKOUT_LIBRARY[selectedFocus].plans;
  const activePlan = planOptions.find(plan => plan.level === selectedLevel) ?? planOptions[0];
  const quickWins = WORKOUT_LIBRARY[selectedFocus].quickWins;

  return (
    <section className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <DumbbellIcon className="h-8 w-8 text-red-400 mr-3" />
          <div>
            <h2 className="text-2xl font-bold">Training Playbooks</h2>
            <p className="text-text-secondary">
              Choose a goal, match your experience, and follow the ready-to-run weekly template. Track progress weekly.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {focusOptions.map((focus) => {
          const { label, description } = WORKOUT_LIBRARY[focus];
          const isActive = focus === selectedFocus;
          return (
            <button
              key={focus}
              onClick={() => setSelectedFocus(focus)}
              className={`px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? 'border-red-400 bg-red-500/10 text-red-200 shadow-card'
                  : 'border-gray-700 bg-primary/30 text-text-secondary hover:border-red-400/60 hover:text-text-primary'
              }`}
            >
              <div className="text-sm font-semibold uppercase tracking-wide">{WORKOUT_LIBRARY[focus].label}</div>
              <p className="text-xs mt-1 max-w-xs">{description}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        {planOptions.map((plan) => {
          const isActive = plan.level === selectedLevel;
          return (
            <button
              key={plan.level}
              onClick={() => setSelectedLevel(plan.level)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive ? 'bg-red-500 text-primary shadow-card' : 'bg-gray-700 text-text-secondary hover:bg-red-500/30 hover:text-text-primary'
              }`}
            >
              {formatTitle(plan.level)}
            </button>
          );
        })}
      </div>

      <article className="bg-primary/40 border border-gray-700/70 rounded-lg p-5 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Plan Overview</h3>
          <p className="text-text-secondary mt-1">{activePlan.summary}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-text-secondary">
          <div className="bg-secondary/60 rounded-md p-3 border border-gray-700/60">
            <div className="text-xs uppercase tracking-wide text-text-secondary">Suggested Schedule</div>
            <div className="font-semibold text-text-primary mt-1">{activePlan.schedule}</div>
          </div>
          <div className="bg-secondary/60 rounded-md p-3 border border-gray-700/60">
            <div className="text-xs uppercase tracking-wide text-text-secondary">Equipment</div>
            <div className="font-semibold text-text-primary mt-1">{activePlan.equipment}</div>
          </div>
          <div className="bg-secondary/60 rounded-md p-3 border border-gray-700/60">
            <div className="text-xs uppercase tracking-wide text-text-secondary">Progression</div>
            <div className="font-semibold text-text-primary mt-1">{activePlan.progression}</div>
          </div>
        </div>
      </article>

      <div className="space-y-4">
        {activePlan.sessions.map((session) => (
          <div key={session.title} className="bg-primary/40 border border-gray-700/80 rounded-lg">
            <div className="border-b border-gray-700/60 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h4 className="text-lg font-semibold text-text-primary">{session.title}</h4>
                <p className="text-sm text-text-secondary">{session.focus}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-secondary/40 text-text-secondary uppercase tracking-wide text-xs">
                  <tr>
                    <th className="px-5 py-3">Exercise</th>
                    <th className="px-5 py-3 text-center">Sets</th>
                    <th className="px-5 py-3 text-center">Reps / Time</th>
                    <th className="px-5 py-3 text-center">Rest</th>
                    <th className="px-5 py-3 text-left">Coaching Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {session.exercises.map((exercise: Workout, idx: number) => (
                    <tr key={`${session.title}-${idx}`} className="border-t border-gray-700/40">
                      <td className="px-5 py-3 font-semibold text-text-primary">{exercise.name}</td>
                      <td className="px-5 py-3 text-center text-text-secondary">{exercise.sets}</td>
                      <td className="px-5 py-3 text-center text-text-secondary">{exercise.reps}</td>
                      <td className="px-5 py-3 text-center text-text-secondary">{exercise.rest}</td>
                      <td className="px-5 py-3 text-text-secondary">{exercise.note ?? 'Keep technique crisp—quality beats speed.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {session.finisher && (
              <div className="px-5 py-3 border-t border-gray-700/60 text-sm text-accent">
                Finisher: {session.finisher}
              </div>
            )}
          </div>
        ))}
      </div>

      <aside className="bg-secondary/60 border border-gray-700/60 rounded-lg p-5">
        <div className="text-sm uppercase tracking-wide text-text-secondary mb-2">Quick Wins</div>
        <ul className="space-y-2 text-sm text-text-secondary">
          {quickWins.map((tip) => (
            <li key={tip} className="flex">
              <span className="text-red-400 mr-2">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
};

export default WorkoutGenerator;
