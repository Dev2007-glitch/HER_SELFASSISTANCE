/**
 * Real Indian Calendar & Panchang Festival Engine
 * Provides accurate Indian calendar month generation, Sunday marking,
 * weekday alignment, and comprehensive Indian festivals & national holidays.
 */

export const INDIAN_MONTHS_PANCHANG = [
  { eng: 'January', panchang: 'Pausha – Magha', ritu: 'Shishir (Winter)' },
  { eng: 'February', panchang: 'Magha – Phalguna', ritu: 'Shishir / Vasant' },
  { eng: 'March', panchang: 'Phalguna – Chaitra', ritu: 'Vasant (Spring)' },
  { eng: 'April', panchang: 'Chaitra – Vaishakha', ritu: 'Vasant (Spring)' },
  { eng: 'May', panchang: 'Vaishakha – Jyeshtha', ritu: 'Grishma (Summer)' },
  { eng: 'June', panchang: 'Jyeshtha – Ashadha', ritu: 'Grishma (Summer)' },
  { eng: 'July', panchang: 'Ashadha – Shravana', ritu: 'Varsha (Monsoon)' },
  { eng: 'August', panchang: 'Shravana – Bhadrapada', ritu: 'Varsha (Monsoon)' },
  { eng: 'September', panchang: 'Bhadrapada – Ashvina', ritu: 'Sharad (Autumn)' },
  { eng: 'October', panchang: 'Ashvina – Kartika', ritu: 'Sharad (Autumn)' },
  { eng: 'November', panchang: 'Kartika – Margashirsha', ritu: 'Hemant (Pre-Winter)' },
  { eng: 'December', panchang: 'Margashirsha – Pausha', ritu: 'Hemant (Pre-Winter)' }
];

// Major Indian Festivals & Observances (keyed by MM-DD format)
export const INDIAN_FESTIVALS_MAP = {
  // January
  '01-01': { name: "New Year's Day", emoji: '🎉', type: 'national' },
  '01-13': { name: 'Lohri', emoji: '🔥', type: 'festival' },
  '01-14': { name: 'Makar Sankranti / Pongal / Uttarayan', emoji: '🪁', type: 'major_festival' },
  '01-15': { name: 'Indian Army Day / Mattu Pongal', emoji: '🇮🇳', type: 'observance' },
  '01-23': { name: 'Netaji Subhash Chandra Bose Jayanti', emoji: '⭐', type: 'jayanti' },
  '01-26': { name: 'Republic Day (Ganatantra Divas)', emoji: '🇮🇳', type: 'gazetted' },
  '01-30': { name: "Martyrs' Day (Shaheed Diwas)", emoji: '🕊️', type: 'observance' },

  // February
  '02-02': { name: 'Vasant Panchami / Saraswati Puja', emoji: '🌸', type: 'major_festival' },
  '02-14': { name: 'Valentine’s Day', emoji: '💖', type: 'observance' },
  '02-19': { name: 'Chhatrapati Shivaji Maharaj Jayanti', emoji: '🚩', type: 'jayanti' },
  '02-24': { name: 'Guru Ravidas Jayanti', emoji: '🪷', type: 'jayanti' },
  '02-26': { name: 'Maha Shivratri', emoji: '🔱', type: 'major_festival' },

  // March
  '03-08': { name: "International Women's Day", emoji: '💐', type: 'observance' },
  '03-13': { name: 'Holika Dahan', emoji: '🔥', type: 'festival' },
  '03-14': { name: 'Holi (Festival of Colors)', emoji: '🎨', type: 'major_festival' },
  '03-23': { name: 'Shaheed Diwas (Bhagat Singh, Sukhdev, Rajguru)', emoji: '🇮🇳', type: 'observance' },
  '03-30': { name: 'Ugadi / Gudi Padwa / Chaitra Navratri Starts', emoji: '🌿', type: 'major_festival' },
  '03-31': { name: 'Id-ul-Fitr (Ramzan Eid)', emoji: '🌙', type: 'major_festival' },

  // April
  '04-06': { name: 'Ram Navami', emoji: '🏹', type: 'major_festival' },
  '04-10': { name: 'Mahavir Jayanti', emoji: '🕊️', type: 'gazetted' },
  '04-13': { name: 'Baisakhi / Vaisakhi', emoji: '🌾', type: 'festival' },
  '04-14': { name: 'Dr. B.R. Ambedkar Jayanti / Tamil New Year / Vishu', emoji: '⚖️', type: 'gazetted' },
  '04-18': { name: 'Good Friday', emoji: '✝️', type: 'gazetted' },
  '04-20': { name: 'Easter Sunday', emoji: '🥚', type: 'festival' },

  // May
  '05-01': { name: 'Maharashtra Day / Gujarat Day / Labour Day', emoji: '🛠️', type: 'observance' },
  '05-09': { name: 'Rabindranath Tagore Jayanti', emoji: '📜', type: 'jayanti' },
  '05-12': { name: 'Buddha Purnima (Vesak)', emoji: '🪷', type: 'gazetted' },

  // June
  '06-07': { name: 'Bakrid / Eid-ul-Adha', emoji: '🌙', type: 'major_festival' },
  '06-21': { name: 'International Day of Yoga', emoji: '🧘', type: 'observance' },
  '06-27': { name: 'Jagannath Puri Rath Yatra', emoji: '🚩', type: 'major_festival' },

  // July
  '07-07': { name: 'Muharram (Ashura)', emoji: '🌙', type: 'gazetted' },
  '07-10': { name: 'Guru Purnima / Vyasa Puja', emoji: '🙏', type: 'festival' },
  '07-26': { name: 'Kargil Vijay Diwas', emoji: '🎖️', type: 'observance' },

  // August
  '08-15': { name: 'Independence Day (Swatantrata Divas)', emoji: '🇮🇳', type: 'gazetted' },
  '08-16': { name: 'Parsi New Year (Navroz)', emoji: '✨', type: 'festival' },
  '08-28': { name: 'Raksha Bandhan (Rakhi)', emoji: '🧵', type: 'major_festival' },
  '08-30': { name: 'Krishna Janmashtami (Gokulashtami)', emoji: '🦚', type: 'major_festival' },

  // September
  '09-05': { name: "Teachers' Day (Dr. S. Radhakrishnan Jayanti)", emoji: '📚', type: 'observance' },
  '09-12': { name: 'Quiet Presence & Autumn Equinox Prep', emoji: '🌿', type: 'observance' },
  '09-14': { name: 'Hindi Diwas', emoji: '📖', type: 'observance' },
  '09-15': { name: "Engineer's Day / Onam (Thiruvonam)", emoji: '🌸', type: 'major_festival' },
  '09-17': { name: 'Vishwakarma Puja / Anant Chaturdashi', emoji: '⚙️', type: 'festival' },
  '09-19': { name: 'Ganesh Chaturthi (Vinayaka Chavithi)', emoji: '🐘', type: 'major_festival' },
  '09-21': { name: 'Milad-un-Nabi (Eid-e-Milad)', emoji: '🌙', type: 'gazetted' },
  '09-26': { name: 'Navratri Ghatasthapana / Durga Puja Begins', emoji: '🪔', type: 'major_festival' },

  // October
  '10-02': { name: 'Mahatma Gandhi Jayanti & Shastri Jayanti', emoji: '🇮🇳', type: 'gazetted' },
  '10-10': { name: 'Maha Saptami (Durga Puja)', emoji: '🪔', type: 'major_festival' },
  '10-11': { name: 'Maha Ashtami / Kanya Puja / Durga Ashtami', emoji: '🌸', type: 'major_festival' },
  '10-12': { name: 'Maha Navami / Ayudha Puja', emoji: '⚔️', type: 'major_festival' },
  '10-13': { name: 'Dussehra / Vijayadashami', emoji: '🏹', type: 'gazetted' },
  '10-20': { name: 'Karwa Chauth', emoji: '🌕', type: 'festival' },
  '10-29': { name: 'Dhanteras (Dhantrayodashi)', emoji: '🪙', type: 'festival' },
  '10-31': { name: 'Narak Chaturdashi / Chhoti Diwali', emoji: '🪔', type: 'festival' },

  // November
  '11-01': { name: 'Diwali (Deepavali / Lakshmi Puja)', emoji: '🪔✨', type: 'gazetted' },
  '11-02': { name: 'Govardhan Puja / Annakut / Gujarati New Year', emoji: '⛰️', type: 'festival' },
  '11-03': { name: 'Bhai Dooj / Yama Dwitiya', emoji: '🌸', type: 'festival' },
  '11-07': { name: 'Chhath Puja (Sandhya Arghya)', emoji: '☀️', type: 'major_festival' },
  '11-08': { name: 'Chhath Puja (Usha Arghya)', emoji: '🌅', type: 'major_festival' },
  '11-14': { name: "Children's Day (Bal Divas)", emoji: '🎈', type: 'observance' },
  '11-15': { name: 'Guru Nanak Jayanti (Gurpurab) / Kartik Purnima', emoji: '🪷', type: 'gazetted' },
  '11-26': { name: 'Constitution Day (Samvidhan Divas)', emoji: '📜', type: 'observance' },

  // December
  '12-04': { name: 'Indian Navy Day', emoji: '⚓', type: 'observance' },
  '12-23': { name: "Kisan Diwas (National Farmers' Day)", emoji: '🌾', type: 'observance' },
  '12-25': { name: 'Christmas Day', emoji: '🎄', type: 'gazetted' },
  '12-31': { name: "New Year's Eve", emoji: '✨', type: 'observance' }
};

/**
 * Generate accurate Indian Calendar Days Grid for a given Year and Month (0-indexed month: 0 = Jan, 8 = Sep)
 */
export function getIndianCalendarMonthData(year, month) {
  // First day of the month
  const firstDayDate = new Date(year, month, 1);
  // Total days in this month
  const totalDays = new Date(year, month + 1, 0).getDate();
  
  // Starting day of week: 0 = Sunday, 1 = Monday, ... 6 = Saturday
  // We align grid with Monday = 0, Tuesday = 1, ... Saturday = 5, Sunday = 6
  let startingDayOfWeek = firstDayDate.getDay(); // 0 is Sunday
  // Convert to Monday-first index (Monday = 0, Sunday = 6)
  let mondayFirstOffset = (startingDayOfWeek + 6) % 7;

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const currentDayNum = today.getDate();

  const days = [];

  // Previous month padding days
  const prevMonthTotalDays = new Date(year, month, 0).getDate();
  for (let i = mondayFirstOffset - 1; i >= 0; i--) {
    const prevDayNum = prevMonthTotalDays - i;
    days.push({
      dayNumber: prevDayNum,
      isCurrentMonth: false,
      isPadding: true,
      dateKey: `${year}-${String(month).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`,
      dayOfWeek: (startingDayOfWeek - (i + 1) + 7) % 7
    });
  }

  // Current month real days
  for (let day = 1; day <= totalDays; day++) {
    const dayDate = new Date(year, month, day);
    const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isSunday = dayOfWeek === 0;
    const isSaturday = dayOfWeek === 6;
    const isToday = isCurrentMonth && day === currentDayNum;

    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const mmddKey = `${monthStr}-${dayStr}`;
    const fullDateKey = `${year}-${monthStr}-${dayStr}`;

    const festival = INDIAN_FESTIVALS_MAP[mmddKey] || null;

    days.push({
      dayNumber: day,
      monthIndex: month,
      year: year,
      isCurrentMonth: true,
      isPadding: false,
      isSunday,
      isSaturday,
      isToday,
      dayOfWeek,
      dateKey: fullDateKey,
      festival
    });
  }

  // Next month padding days to complete grid (multiples of 7)
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let day = 1; day <= remainingCells; day++) {
    days.push({
      dayNumber: day,
      isCurrentMonth: false,
      isPadding: true,
      dateKey: `${year}-${String(month + 2).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      dayOfWeek: (days.length) % 7
    });
  }

  // Collect all festivals for this active month
  const monthFestivals = [];
  for (let day = 1; day <= totalDays; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const mmddKey = `${monthStr}-${dayStr}`;
    if (INDIAN_FESTIVALS_MAP[mmddKey]) {
      const dDate = new Date(year, month, day);
      const weekdayName = dDate.toLocaleDateString('en-US', { weekday: 'short' });
      monthFestivals.push({
        day,
        weekday: weekdayName,
        isSunday: dDate.getDay() === 0,
        ...INDIAN_FESTIVALS_MAP[mmddKey]
      });
    }
  }

  return {
    year,
    month,
    monthName: INDIAN_MONTHS_PANCHANG[month].eng,
    panchang: INDIAN_MONTHS_PANCHANG[month].panchang,
    ritu: INDIAN_MONTHS_PANCHANG[month].ritu,
    totalDays,
    days,
    monthFestivals
  };
}
