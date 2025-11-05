import React from 'react';
import { Weight, Medal, Timer } from 'lucide-react';
import type { Achievement } from '@ocs/types';

const iconMap = {
  weight: Weight,
  distance: Medal,
  duration: Timer,
};

export const getLevelData = (level: number) => {
  switch (level) {
    case 1:
      return {
        levelColor: 'bg-gray-400 border-gray-600',
        iconColor: 'text-white',
        progressColor: 'bg-gray-700',
        title: 'Newbie',
      };
    case 2:
      return {
        levelColor: 'bg-slate-400 border-slate-600',
        iconColor: 'text-blue-300',
        progressColor: 'bg-slate-700',
        title: 'Rookie',
      };
    case 3:
      return {
        levelColor: 'bg-blue-400 border-blue-600',
        iconColor: 'text-emerald-300',
        progressColor: 'bg-blue-700',
        title: 'Scout',
      };
    case 4:
      return {
        levelColor: 'bg-cyan-400 border-cyan-600',
        iconColor: 'text-lime-400',
        progressColor: 'bg-cyan-700',
        title: 'Apprentice',
      };
    case 5:
      return {
        levelColor: 'bg-green-400 border-green-600',
        iconColor: 'text-fuchsia-400',
        progressColor: 'bg-green-700',
        title: 'Adventurer',
      };
    case 6:
      return {
        levelColor: 'bg-lime-500 border-lime-800',
        iconColor: 'text-indigo-500',
        progressColor: 'bg-lime-700',
        title: 'Challenger',
      };
    case 7:
      return {
        levelColor: 'bg-indigo-400 border-indigo-600',
        iconColor: 'text-pink-300',
        progressColor: 'bg-indigo-700',
        title: 'Expert',
      };
    case 8:
      return {
        levelColor: 'bg-violet-400 border-violet-600',
        iconColor: 'text-orange-300',
        progressColor: 'bg-violet-700',
        title: 'Master',
      };
    case 9:
      return {
        levelColor: 'bg-fuchsia-400 border-fuchsia-600',
        iconColor: 'text-amber-400',
        progressColor: 'bg-fuchsia-700',
        title: 'Hero',
      };
    case 10:
      return {
        levelColor: 'bg-amber-400 border-amber-600',
        iconColor: 'text-red-600',
        progressColor: 'bg-amber-700',
        title: 'Legend',
      };
    default:
      return {
        levelColor: 'bg-gray-400 border-gray-600',
        iconColor: '',
        progressColor: 'bg-gray-700',
        title: 'Newcomer',
      };
  }
};

export const Badge: React.FC<Achievement> = ({
  type,
  value,
  level,
  nextLevel,
  label,
}) => {
  const Icon = iconMap[type];
  const progress =
    nextLevel && nextLevel > 0 ? Math.min((value / nextLevel) * 100, 100) : 0;

  const { levelColor, iconColor, progressColor, title } = getLevelData(level);

  return (
    <div className='p-10 m-10 border-1 border-slate-600 rounded-2xl'>
      <h2 className='text-2xl text-center mb-5 font-serif'>{label}</h2>
      <div
        className={`flex flex-col items-center justify-center rounded-2xl shadow-md border p-4 m-1 w-40 h-50 transition-all duration-300 text-white ${levelColor}`}
      >
        <p className='text-1xl font-medium uppercase tracking-wide text-center mb-2 text-fu'>
          {title}
        </p>
        <Icon className={`w-16 h-16 ${iconColor}`} />
        <div className='flex items-center justify-center gap-2 mb-1 text-'>
          <span className='text-1xl font-semibold'>Level {level}</span>
        </div>

        {level < 10 && (
          <>
            <div className='w-full bg-gray-200 rounded-full h-2.5 overflow-hidden'>
              <div
                className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className='text-sm mt-1 text-center text-white opacity-90'>
              {Math.round(progress)}% to next level
            </p>
          </>
        )}
      </div>
    </div>
  );
};
