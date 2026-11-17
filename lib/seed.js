const names = [
  "Aanya", "Riya", "Kavya", "Meera", "Isha", "Tara", "Naina", "Diya", "Sana",
  "Anika", "Pooja", "Zoya", "Aditi", "Neha", "Simran", "Ritika", "Mahi", "Sara",
  "Arjun", "Kabir", "Rohan", "Vihaan", "Aarav", "Ishaan", "Dev", "Karan", "Yash",
  "Reyansh", "Nikhil", "Aryan", "Rahul", "Sameer", "Veer", "Tushar", "Harsh", "Dhruv",
];

const places = [
  "Delhi University", "IIT Delhi", "Gurgaon", "Noida", "Jamia Millia Islamia",
  "Ambedkar University", "Amity Noida", "Faridabad", "Ghaziabad", "Hauz Khas, Delhi",
];

const bios = [
  "Coffee first, conversations second.",
  "Weekend trekker, weekday overthinker.",
  "Will beat you at Mario Kart. Probably.",
  "Looking for someone to share fries with.",
  "Part-time foodie, full-time dreamer.",
  "Bookstore wanderer and playlist curator.",
  "Gym in the morning, Netflix at night.",
  "Always up for a late-night chai run.",
  "Here for good vibes and better memes.",
  "Amateur photographer, professional napper.",
  "Plant parent of 12 (and counting).",
  "Ask me about my favourite album.",
];

const pool = [
  "Music", "Travel", "Movies", "Fitness", "Photography", "Cooking",
  "Gaming", "Reading", "Hiking", "Art", "Coffee", "Dancing",
];

export const profiles = names.map((name, i) => ({
  id: i + 1,
  name,
  age: 19 + (i % 8),
  photo: `https://picsum.photos/seed/coy${i + 1}/600/800`,
  bio: bios[i % bios.length],
  city: places[i % places.length],
  interests: [0, 1, 2].map((k) => pool[(i * 3 + k * 5) % pool.length]),
  // every 4th profile has already liked the logged-in user (9 of 36)
  likesMe: i % 4 === 1 ? 1 : 0,
}));