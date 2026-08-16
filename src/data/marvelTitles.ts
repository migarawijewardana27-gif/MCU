import { MarvelTitle } from '@/types';

const rawTitles = [
  // --- MULTIVERSE MAIN STORYLINE (isEssential: true) ---
  
  // The Infinity Saga & Multiverse Saga (MCU Core)
  { title: "Iron Man", releaseYear: 2008, type: "movie", isEssential: true },
  { title: "The Incredible Hulk", releaseYear: 2008, type: "movie", isEssential: true },
  { title: "Iron Man 2", releaseYear: 2010, type: "movie", isEssential: true },
  { title: "Thor", releaseYear: 2011, type: "movie", isEssential: true },
  { title: "Captain America: The First Avenger", releaseYear: 2011, type: "movie", isEssential: true },
  { title: "The Avengers", releaseYear: 2012, type: "movie", isEssential: true },
  { title: "Iron Man 3", releaseYear: 2013, type: "movie", isEssential: true },
  { title: "Thor: The Dark World", releaseYear: 2013, type: "movie", isEssential: true },
  { title: "Captain America: The Winter Soldier", releaseYear: 2014, type: "movie", isEssential: true },
  { title: "Guardians of the Galaxy", releaseYear: 2014, type: "movie", isEssential: true },
  { title: "Avengers: Age of Ultron", releaseYear: 2015, type: "movie", isEssential: true },
  { title: "Ant-Man", releaseYear: 2015, type: "movie", isEssential: true },
  { title: "Captain America: Civil War", releaseYear: 2016, type: "movie", isEssential: true },
  { title: "Doctor Strange", releaseYear: 2016, type: "movie", isEssential: true },
  { title: "Guardians of the Galaxy Vol. 2", releaseYear: 2017, type: "movie", isEssential: true },
  { title: "Spider-Man: Homecoming", releaseYear: 2017, type: "movie", isEssential: true },
  { title: "Thor: Ragnarok", releaseYear: 2017, type: "movie", isEssential: true },
  { title: "Black Panther", releaseYear: 2018, type: "movie", isEssential: true },
  { title: "Avengers: Infinity War", releaseYear: 2018, type: "movie", isEssential: true },
  { title: "Ant-Man and the Wasp", releaseYear: 2018, type: "movie", isEssential: true },
  { title: "Captain Marvel", releaseYear: 2019, type: "movie", isEssential: true },
  { title: "Avengers: Endgame", releaseYear: 2019, type: "movie", isEssential: true },
  { title: "Spider-Man: Far From Home", releaseYear: 2019, type: "movie", isEssential: true },
  { title: "WandaVision", season: 1, releaseYear: 2021, type: "tv", isEssential: true },
  { title: "The Falcon and the Winter Soldier", season: 1, releaseYear: 2021, type: "tv", isEssential: true },
  { title: "Loki", season: 1, releaseYear: 2021, type: "tv", isEssential: true },
  { title: "Black Widow", releaseYear: 2021, type: "movie", isEssential: true },
  { title: "What If...?", season: 1, releaseYear: 2021, type: "tv", isEssential: true },
  { title: "Shang-Chi and the Legend of the Ten Rings", releaseYear: 2021, type: "movie", isEssential: true },
  { title: "Hawkeye", season: 1, releaseYear: 2021, type: "tv", isEssential: true },
  { title: "Spider-Man: No Way Home", releaseYear: 2021, type: "movie", isEssential: true },
  { title: "Doctor Strange in the Multiverse of Madness", releaseYear: 2022, type: "movie", isEssential: true },
  { title: "Ms. Marvel", season: 1, releaseYear: 2022, type: "tv", isEssential: false },
  { title: "Thor: Love and Thunder", releaseYear: 2022, type: "movie", isEssential: true },
  { title: "Black Panther: Wakanda Forever", releaseYear: 2022, type: "movie", isEssential: true },
  { title: "Ant-Man and the Wasp: Quantumania", releaseYear: 2023, type: "movie", isEssential: true },
  { title: "Guardians of the Galaxy Vol. 3", releaseYear: 2023, type: "movie", isEssential: true },
  { title: "Loki", season: 2, releaseYear: 2023, type: "tv", isEssential: true },
  { title: "The Marvels", releaseYear: 2023, type: "movie", isEssential: true },
  { title: "What If...?", season: 2, releaseYear: 2023, type: "tv", isEssential: true },
  { title: "Deadpool & Wolverine", releaseYear: 2024, type: "movie", isEssential: true },
  { title: "Agatha All Along", season: 1, releaseYear: 2024, type: "tv", isEssential: true },
  { title: "What If...?", season: 3, releaseYear: 2024, type: "tv", isEssential: true },
  { title: "Captain America: Brave New World", releaseYear: 2025, type: "movie", isEssential: true },
  { title: "Daredevil: Born Again", season: 1, releaseYear: 2025, type: "tv", isEssential: true },
  { title: "Thunderbolts*", releaseYear: 2025, type: "movie", isEssential: true },
  { title: "Ironheart", season: 1, releaseYear: 2025, type: "tv", isEssential: false },
  { title: "The Fantastic Four: First Steps", releaseYear: 2025, type: "movie", isEssential: true },
  { title: "Wonder Man", season: 1, releaseYear: 2026, type: "tv", isEssential: false },
  { title: "Daredevil: Born Again", season: 2, releaseYear: 2026, type: "tv", isEssential: true },
  { title: "Spider-Man: Brand New Day", releaseYear: 2026, type: "movie", isEssential: true },
  { title: "VisionQuest", season: 1, releaseYear: 2026, type: "tv", isEssential: true },
  { title: "Avengers: Endgame Encore", releaseYear: 2026, type: "movie", isEssential: true },
  { title: "Avengers: Doomsday", releaseYear: 2026, type: "movie", isEssential: true },

  // Defenders Saga (Netflix Street Level)
  { title: "Daredevil", season: 1, releaseYear: 2015, type: "tv", isEssential: false },
  { title: "Jessica Jones", season: 1, releaseYear: 2015, type: "tv", isEssential: false },
  { title: "Daredevil", season: 2, releaseYear: 2016, type: "tv", isEssential: false },
  { title: "Luke Cage", season: 1, releaseYear: 2016, type: "tv", isEssential: false },
  { title: "The Defenders", season: 1, releaseYear: 2017, type: "tv", isEssential: false },
  { title: "The Punisher", season: 1, releaseYear: 2017, type: "tv", isEssential: false },
  { title: "Daredevil", season: 3, releaseYear: 2018, type: "tv", isEssential: false },
  { title: "The Punisher: One Last Kill", releaseYear: 2026, type: "movie", isEssential: true },

  // Fox X-Men Universe
  { title: "X-Men", releaseYear: 2000, type: "movie", isEssential: true },
  { title: "X2: X-Men United", releaseYear: 2003, type: "movie", isEssential: true },
  { title: "X-Men: The Last Stand", releaseYear: 2006, type: "movie", isEssential: true },
  { title: "X-Men Origins: Wolverine", releaseYear: 2009, type: "movie", isEssential: true },
  { title: "X-Men: First Class", releaseYear: 2011, type: "movie", isEssential: true },
  { title: "The Wolverine", releaseYear: 2013, type: "movie", isEssential: true },
  { title: "X-Men: Days of Future Past", releaseYear: 2014, type: "movie", isEssential: true },
  { title: "Deadpool", releaseYear: 2016, type: "movie", isEssential: true },
  { title: "X-Men: Apocalypse", releaseYear: 2016, type: "movie", isEssential: true },
  { title: "Logan", releaseYear: 2017, type: "movie", isEssential: true },
  { title: "Deadpool 2", releaseYear: 2018, type: "movie", isEssential: true },
  { title: "Dark Phoenix", releaseYear: 2019, type: "movie", isEssential: true },
  { title: "The New Mutants", releaseYear: 2020, type: "movie", isEssential: true },

  // Sony Spider-Verse (Live Action & Animated)
  { title: "Spider-Man", releaseYear: 2002, type: "movie", isEssential: true },
  { title: "Spider-Man 2", releaseYear: 2004, type: "movie", isEssential: true },
  { title: "Spider-Man 3", releaseYear: 2007, type: "movie", isEssential: true },
  { title: "The Amazing Spider-Man", releaseYear: 2012, type: "movie", isEssential: true },
  { title: "The Amazing Spider-Man 2", releaseYear: 2014, type: "movie", isEssential: true },
  { title: "Spider-Man: Into the Spider-Verse", releaseYear: 2018, type: "movie", isEssential: true },
  { title: "Spider-Man: Across the Spider-Verse", releaseYear: 2023, type: "movie", isEssential: true },
  
  // --- MULTIVERSE MADNESS / SIDE QUESTS (isEssential: false) ---
  
  // Legacy & Miscellaneous
  { title: "Blade", releaseYear: 1998, type: "movie", isEssential: false },
  { title: "Blade II", releaseYear: 2002, type: "movie", isEssential: false },
  { title: "Daredevil", releaseYear: 2003, type: "movie", isEssential: false },
  { title: "Hulk", releaseYear: 2003, type: "movie", isEssential: false },
  { title: "The Punisher", releaseYear: 2004, type: "movie", isEssential: false },
  { title: "Blade: Trinity", releaseYear: 2004, type: "movie", isEssential: false },
  { title: "Elektra", releaseYear: 2005, type: "movie", isEssential: false },
  { title: "Man-Thing", releaseYear: 2005, type: "movie", isEssential: false },
  { title: "Fantastic Four", releaseYear: 2005, type: "movie", isEssential: false },
  { title: "Ghost Rider", releaseYear: 2007, type: "movie", isEssential: false },
  { title: "Fantastic Four: Rise of the Silver Surfer", releaseYear: 2007, type: "movie", isEssential: false },
  { title: "Punisher: War Zone", releaseYear: 2008, type: "movie", isEssential: false },
  { title: "Ghost Rider: Spirit of Vengeance", releaseYear: 2011, type: "movie", isEssential: false },
  { title: "Fantastic Four", releaseYear: 2015, type: "movie", isEssential: false },
  
  // MCU Ancillary TV Shows
  { title: "Agents of S.H.I.E.L.D.", season: 1, releaseYear: 2013, type: "tv", isEssential: false },
  { title: "Agent Carter", season: 1, releaseYear: 2015, type: "tv", isEssential: false },
  { title: "Legion", season: 1, releaseYear: 2017, type: "tv", isEssential: false },
  { title: "Iron Fist", season: 1, releaseYear: 2017, type: "tv", isEssential: false },
  { title: "Inhumans", season: 1, releaseYear: 2017, type: "tv", isEssential: false },
  { title: "The Gifted", season: 1, releaseYear: 2017, type: "tv", isEssential: false },
  { title: "Runaways", season: 1, releaseYear: 2017, type: "tv", isEssential: false },
  { title: "Cloak & Dagger", season: 1, releaseYear: 2018, type: "tv", isEssential: false },
  { title: "Helstrom", season: 1, releaseYear: 2020, type: "tv", isEssential: false },
  { title: "Moon Knight", season: 1, releaseYear: 2022, type: "tv", isEssential: true },
  { title: "She-Hulk: Attorney at Law", season: 1, releaseYear: 2022, type: "tv", isEssential: false },
  { title: "Secret Invasion", season: 1, releaseYear: 2023, type: "tv", isEssential: false },
  { title: "Echo", season: 1, releaseYear: 2024, type: "tv", isEssential: false },
  
  // Sony Villain Universe
  { title: "Venom", releaseYear: 2018, type: "movie", isEssential: true },
  { title: "Venom: Let There Be Carnage", releaseYear: 2021, type: "movie", isEssential: true },
  { title: "Morbius", releaseYear: 2022, type: "movie", isEssential: false },
  { title: "Madame Web", releaseYear: 2024, type: "movie", isEssential: true },
  { title: "Venom: The Last Dance", releaseYear: 2024, type: "movie", isEssential: true },
  { title: "Kraven the Hunter", releaseYear: 2024, type: "movie", isEssential: false }
].sort((a, b) => a.releaseYear - b.releaseYear).map(t => {
  let postCreditScenes = t.type === 'movie' ? 2 : undefined;
  if (t.title === 'Avengers: Endgame' || t.title === 'Logan') {
    postCreditScenes = 0;
  }
  return {
    ...t,
    postCreditScenes,
    id: t.title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + t.releaseYear + (t.season ? `_s${t.season}` : '')
  };
}) as MarvelTitle[];

export const MARVEL_TITLES: MarvelTitle[] = rawTitles;
