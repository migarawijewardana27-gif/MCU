export interface DependencyNode {
  id: string; // Target title ID
  dependsOn: string[]; // List of prerequisite title IDs
}

export interface NarrativeArc {
  id: string;
  name: string;
  color: string;
  dependencies: DependencyNode[];
}

export const INFINITY_SAGA_ARC: NarrativeArc = {
  id: 'infinity_saga',
  name: 'The Infinity Saga',
  color: '#EC1D24', // Marvel Red
  dependencies: [
    { id: 'the_avengers_2012', dependsOn: ['iron_man_2008', 'captain_america__the_first_avenger_2011', 'thor_2011'] },
    { id: 'avengers__age_of_ultron_2015', dependsOn: ['the_avengers_2012', 'captain_america__the_winter_soldier_2014'] },
    { id: 'captain_america__civil_war_2016', dependsOn: ['avengers__age_of_ultron_2015', 'captain_america__the_winter_soldier_2014'] },
    { id: 'avengers__infinity_war_2018', dependsOn: ['captain_america__civil_war_2016', 'thor__ragnarok_2017', 'guardians_of_the_galaxy_2014', 'doctor_strange_2016'] },
    { id: 'avengers__endgame_2019', dependsOn: ['avengers__infinity_war_2018', 'ant_man_and_the_wasp_2018'] },
  ]
};

export const MULTIVERSE_ARC: NarrativeArc = {
  id: 'multiverse_saga',
  name: 'The Multiverse Saga',
  color: '#8B5CF6', // Purple
  dependencies: [
    { id: 'loki_2021_s1', dependsOn: ['avengers__endgame_2019'] },
    { id: 'spider_man__no_way_home_2021', dependsOn: ['spider_man__far_from_home_2019', 'doctor_strange_2016'] },
    { id: 'doctor_strange_in_the_multiverse_of_madness_2022', dependsOn: ['wandavision_2021_s1', 'spider_man__no_way_home_2021'] },
    { id: 'ant_man_and_the_wasp__quantumania_2023', dependsOn: ['loki_2021_s1'] },
    { id: 'deadpool_and_wolverine_2024', dependsOn: ['loki_2021_s1', 'deadpool_2_2018'] },
  ]
};

export const STREET_LEVEL_ARC: NarrativeArc = {
  id: 'defenders_saga',
  name: 'Street Level / Defenders',
  color: '#F59E0B', // Amber
  dependencies: [
    { id: 'the_defenders_2017_s1', dependsOn: ['daredevil_2015_s1', 'jessica_jones_2015_s1', 'luke_cage_2016_s1', 'iron_fist_2017_s1'] },
    { id: 'daredevil_2015_s2', dependsOn: ['daredevil_2015_s1'] },
    { id: 'daredevil_2015_s3', dependsOn: ['the_defenders_2017_s1'] },
    { id: 'spider_man__no_way_home_2021', dependsOn: ['daredevil_2015_s3'] }, // Matt Murdock cameo
    { id: 'echo_2024_s1', dependsOn: ['hawkeye_2021_s1', 'daredevil_2015_s3'] },
    { id: 'daredevil__born_again_2025_s1', dependsOn: ['echo_2024_s1'] },
  ]
};

export const ALL_ARCS = [INFINITY_SAGA_ARC, MULTIVERSE_ARC, STREET_LEVEL_ARC];

// Helper to find all prerequisites for a specific title across all active arcs
export function getPrerequisitesForTitle(titleId: string, activeArcId?: string | null): { dependsOn: string[], color: string }[] {
  const prerequisites: { dependsOn: string[], color: string }[] = [];
  
  const arcsToCheck = activeArcId 
    ? ALL_ARCS.filter(a => a.id === activeArcId)
    : ALL_ARCS;

  for (const arc of arcsToCheck) {
    const node = arc.dependencies.find(d => d.id === titleId);
    if (node) {
      prerequisites.push({ dependsOn: node.dependsOn, color: arc.color });
    }
  }

  return prerequisites;
}
