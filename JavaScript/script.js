const animals = [
  {
    name: 'Gray Wolf',
    category: 'Mammals',
    scientificName: 'Canis lupus',
    description: 'The gray wolf is Michigan’s largest native land predator. It typically lives in packs and has a strong, distinctive howl.',
    emoji: '🐺',
    sound: 'howl'
  },
  {
    name: 'White-tailed Deer',
    category: 'Mammals',
    scientificName: 'Odocoileus virginianus',
    description: 'A graceful woodland grazer, the white-tailed deer is common across Michigan forests and meadows.',
    emoji: '🦌',
    sound: 'snort'
  },
  {
    name: 'Bald Eagle',
    category: 'Birds',
    scientificName: 'Haliaeetus leucocephalus',
    description: 'The bald eagle is a powerful symbol of the Northwoods, soaring above lakes and rivers with keen eyesight.',
    emoji: '🦅',
    sound: 'screech'
  },
  {
    name: 'American Robin',
    category: 'Birds',
    scientificName: 'Turdus migratorius',
    description: 'The American robin is a familiar spring songbird known for its bright eye ring and cheerful morning calls.',
    emoji: '🐦',
    sound: 'chirp'
  },
  {
    name: 'Monarch Butterfly',
    category: 'Insects',
    scientificName: 'Danaus plexippus',
    description: 'Monarch butterflies travel long distances and brighten Michigan gardens with their orange and black wings.',
    emoji: '🦋',
    sound: 'flutter'
  },
  {
    name: 'Firefly',
    category: 'Insects',
    scientificName: 'Lampyridae',
    description: 'Fireflies illuminate summer nights in Michigan with flashing lights used for communication and courtship.',
    emoji: '✨',
    sound: 'glow'
  }
];

const state = {
  selectedCategory: 'All',
  currentIndex: 0
};

const animalNameEl = document.getElementById('animalName');
const animalScientificEl = document.getElementById('animalScientific');
const animalDescriptionEl = document.getElementById('animalDescription');
const animalCategoryEl = document.getElementById('animalCategory');
const animalImageEl = document.getElementById('animalImage');
const categoryButtons = document.querySelectorAll('.category-button');
const playSoundButton = document.getElementById('playSound');
const nextAnimalButton = document.getElementById('nextAnimal');

function getVisibleAnimals() {
  if (state.selectedCategory === 'All') {
    return animals;
  }

  return animals.filter((animal) => animal.category === state.selectedCategory);
}

function renderAnimal() {
  const visibleAnimals = getVisibleAnimals();

  if (!visibleAnimals.length) {
    return;
  }

  if (state.currentIndex >= visibleAnimals.length) {
    state.currentIndex = 0;
  }

  const animal = visibleAnimals[state.currentIndex];
  animalNameEl.textContent = animal.name;
  animalScientificEl.textContent = animal.scientificName;
  animalDescriptionEl.textContent = animal.description;
  animalCategoryEl.textContent = animal.category;
  animalImageEl.textContent = animal.emoji;
}

function setCategory(category) {
  state.selectedCategory = category;
  state.currentIndex = 0;

  categoryButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle('active', isActive);
  });

  renderAnimal();
}

function playPattern(freq, type, duration, volumeValue) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  const audioContext = new AudioCtx();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = freq;

  gainNode.gain.setValueAtTime(volumeValue, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);

  oscillator.onended = () => audioContext.close();
}

function playAnimalSound() {
  const visibleAnimals = getVisibleAnimals();
  const animal = visibleAnimals[state.currentIndex];

  if (!animal) {
    return;
  }

  const soundMap = {
    howl: [220, 180, 140],
    snort: [120, 80, 60],
    screech: [680, 520, 440],
    chirp: [990, 1250, 1450],
    flutter: [420, 330, 280],
    glow: [700, 500, 790]
  };

  const tones = soundMap[animal.sound] || [440, 330, 260];
  tones.forEach((freq, index) => {
    setTimeout(() => {
      playPattern(freq, index % 2 === 0 ? 'triangle' : 'sine', 0.25, 0.04);
    }, index * 120);
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => setCategory(button.dataset.category));
});

playSoundButton.addEventListener('click', playAnimalSound);
nextAnimalButton.addEventListener('click', () => {
  const visibleAnimals = getVisibleAnimals();
  state.currentIndex = (state.currentIndex + 1) % visibleAnimals.length;
  renderAnimal();
});

renderAnimal();
