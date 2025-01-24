const adjectives = [
    'Silent', 'Shadow', 'Phantom', 'Ghost', 'Stealth',
    'Midnight', 'Crystal', 'Golden', 'Iron', 'Silver',
    'Crimson', 'Azure', 'Obsidian', 'Emerald', 'Diamond'
  ];
  
  const nouns = [
    'Hawk', 'Phoenix', 'Dragon', 'Tiger', 'Eagle',
    'Wolf', 'Serpent', 'Lion', 'Raven', 'Falcon',
    'Panther', 'Cobra', 'Viper', 'Griffin', 'Kraken'
  ];
  
  export function generateCodename() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `The ${adjective} ${noun}`;
  }