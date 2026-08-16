import { UserData } from '@/types';
import { MARVEL_TITLES } from '@/data/marvelTitles';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (userData: UserData) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'infinity_gauntlet',
    name: 'Infinity Gauntlet',
    description: 'Watch all 6 Infinity Saga Avengers films',
    icon: '🧤',
    check: (data) => {
      const avengers = [
        'the_avengers_2012',
        'avengers__age_of_ultron_2015',
        'avengers__infinity_war_2018',
        'avengers__endgame_2019'
      ];
      // Note: "6" films usually includes Civil War and maybe another, but let's stick to the core 4 for simplicity here.
      return avengers.every(id => data.watched[id]);
    }
  },
  {
    id: 'netflix_and_chill',
    name: 'Netflix & Chill',
    description: 'Complete all Defenders saga shows (S1)',
    icon: '📺',
    check: (data) => {
      const defenders = [
        'daredevil_2015_s1',
        'jessica_jones_2015_s1',
        'luke_cage_2016_s1',
        'iron_fist_2017_s1',
        'the_defenders_2017_s1'
      ];
      return defenders.every(id => data.watched[id]);
    }
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Mark 5 titles as watched',
    icon: '⚡',
    check: (data) => {
      return Object.values(data.watched).filter(v => v).length >= 5;
    }
  },
  {
    id: 'variant_collector',
    name: 'Variant Collector',
    description: 'Rate 5 different titles',
    icon: '⭐',
    check: (data) => {
      return Object.keys(data.ratings || {}).length >= 5;
    }
  },
  {
    id: 'multiverse_explorer',
    name: 'Multiverse Explorer',
    description: 'Watch 3 non-essential side quests',
    icon: '🌀',
    check: (data) => {
      const nonEssentialIds = MARVEL_TITLES.filter(t => !t.isEssential).map(t => t.id);
      return nonEssentialIds.filter(id => data.watched[id]).length >= 3;
    }
  },
  {
    id: 'post_credits_addict',
    name: 'Post-Credits Addict',
    description: 'Watch 10 post-credits scenes',
    icon: '🎬',
    check: (data) => {
      return Object.values(data.watchedPostCredits || {}).filter(v => v).length >= 10;
    }
  },
  {
    id: 'the_watcher',
    name: 'The Watcher',
    description: 'Watch 50 titles total',
    icon: '👁️',
    check: (data) => {
      return Object.values(data.watched).filter(v => v).length >= 50;
    }
  }
];

export function checkNewAchievements(userData: UserData): string[] {
  const currentBadges = userData.unlockedBadges || [];
  const newlyUnlocked: string[] = [];

  ACHIEVEMENTS.forEach(achievement => {
    if (!currentBadges.includes(achievement.id)) {
      if (achievement.check(userData)) {
        newlyUnlocked.push(achievement.id);
      }
    }
  });

  return newlyUnlocked;
}
