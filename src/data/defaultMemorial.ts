import {
  MemorialProfile,
  TributeItem,
  PhotoMemory,
  OrderOfServiceItem,
  HymnItem,
  LifeMilestone,
} from '../types';

import portraitDefault from '../assets/images/elder_portrait_1786996135067.jpg';
import cloudsDefault from '../assets/images/heavenly_clouds_1786996146594.jpg';
import waxSealDefault from '../assets/images/gold_wax_seal_1786996159757.jpg';

export { portraitDefault, cloudsDefault, waxSealDefault };

export const defaultMemorial: MemorialProfile = {
  id: 'peter-abiodun-oyenuga-1953-2024',
  headerSuperTitle: "H E A V E N ' S   G A I N",
  mainHeadline: 'TRANSITION TO GLORY',
  transitionPreamble:
    'With grateful hearts for a life well spent, we announce the transition to glory of our dear Husband, Father, Grandfather, Brother, and Friend:',
  fullName: 'PETER ABIODUN OYENUGA',
  honorific: 'Pa / Chief',
  birthYear: '1953',
  passingYear: '2024',
  exactDateOfBirth: '14th August 1953',
  exactDateOfPassing: '28th December 2024',
  age: 71,
  sealLabel: 'AGED 71 YEARS',
  portraitUrl: portraitDefault,
  backgroundUrl: cloudsDefault,
  themeColor: 'burgundy',
  officiatingChurch: 'Vine Branch Church Apata, Moor Plantation GRA Ibadan',
  serviceOfSongs: {
    title: 'SERVICE OF SONGS',
    dateTime: 'Thursday 13th February 2025 // 5pm',
    venueName: 'Vine Branch Church Apata',
    address: 'Moor Plantation GRA, Ibadan, Oyo State, Nigeria',
    locationMapUrl: 'https://maps.google.com/?q=Vine+Branch+Church+Apata+Ibadan',
  },
  funeralService: {
    title: 'FUNERAL SERVICE',
    dateTime: '14th February, 2025',
    lyingInState: 'Lying in state 9am',
    serviceStartTime: 'Funeral Service 10am',
    venueName: 'Vine Branch Church Apata',
    address: 'Moor Plantation GRA, Ibadan, Oyo State, Nigeria',
    locationMapUrl: 'https://maps.google.com/?q=Vine+Branch+Church+Apata+Ibadan',
  },
  intermentNote: 'Private interment immediately after service.',
  receptionDetail: {
    venue: 'The Grand Marquee Event Center, Ring Road, Ibadan',
    time: 'Immediately following funeral service & interment (1:00 PM)',
    note: 'Entertainment of guests & Celebration of a glorious life.',
  },
};

export const defaultTributes: TributeItem[] = [
  {
    id: 'trib-1',
    author: 'Deaconess Folashade Oyenuga',
    relationship: 'Wife / Spouse',
    content:
      'My dearest husband, Peter. Words fail me to capture 46 years of boundless love, companionship, and steadfast devotion. You were my rock, my prayer partner, and the gentlest leader of our home. You finished your race with royal grace, integrity, and faith in God. Rest peacefully in the bosom of our Lord until that glorious resurrection morning.',
    date: 'February 2, 2025',
    candleLit: true,
    candleColor: '#F5D77F',
    location: 'Ibadan, Nigeria',
  },
  {
    id: 'trib-2',
    author: 'Engr. Babatunde & Dr. Ronke Oyenuga',
    relationship: 'Children',
    content:
      'Daddy, your life was a masterclass in wisdom, humility, discipline, and generosity. You sacrificed everything to give us the finest education and instilled in us a profound love for God. Your laughter still echoes in our home and your proverbs continue to guide our daily lives. We celebrate a life that truly brought heaven down to earth.',
    date: 'February 3, 2025',
    candleLit: true,
    candleColor: '#E8C15A',
    location: 'London, United Kingdom',
  },
  {
    id: 'trib-3',
    author: 'Tobi, Sharon & Michelle Oyenuga',
    relationship: 'Grandchildren',
    content:
      'Grandpa, thank you for the warmest hugs, the sweet peppermint candies, and the bedtime bible stories whenever we visited during holidays. You made each of us feel deeply cherished and special. We miss you so much and promise to make you proud always.',
    date: 'February 5, 2025',
    candleLit: true,
    candleColor: '#FFF0D0',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'trib-4',
    author: 'Pastor & Council of Elders, Vine Branch Church',
    relationship: 'Church & Ministry',
    content:
      'Pa Peter Abiodun Oyenuga was a pillar of faith, wisdom, and selfless service in the Vineyard of the Lord. His contributions to the development of our church community and youth mentorship will never be forgotten. Truly, precious in the sight of the Lord is the death of His saints.',
    date: 'February 6, 2025',
    candleLit: true,
    candleColor: '#F5D77F',
    location: 'Ibadan, Nigeria',
  },
  {
    id: 'trib-5',
    author: 'Chief Olumide Adeyemi',
    relationship: 'Colleague / Friend',
    content:
      'A brother of six decades, a noble gentleman of unquestionable character and extraordinary loyalty. Peter stood tall in every storm and illuminated every room he stepped into. Sleep on, my dearest friend and brother.',
    date: 'February 7, 2025',
    candleLit: true,
    candleColor: '#E8C15A',
    location: 'Abeokuta, Nigeria',
  },
];

export const defaultOrderOfService: OrderOfServiceItem[] = [
  {
    id: 'oos-1',
    orderNumber: 1,
    timeEstimate: '9:00 AM',
    title: 'Lying in State & Final Viewing',
    conductedBy: 'The Family & Funeral Marshals',
    details: 'Solemn musical prelude and final family viewing.',
  },
  {
    id: 'oos-2',
    orderNumber: 2,
    timeEstimate: '10:00 AM',
    title: 'Processional Hymn',
    conductedBy: 'Choir & Congregation',
    hymnRef: 'Hymn 1: Great Is Thy Faithfulness',
    details: 'Ministers and immediate family enter the sanctuary.',
  },
  {
    id: 'oos-3',
    orderNumber: 3,
    timeEstimate: '10:10 AM',
    title: 'Opening Prayer & Sentences',
    conductedBy: 'Rev. Dr. S. O. Adeleke',
    details: 'Invocation and scripture sentences of comfort and hope.',
  },
  {
    id: 'oos-4',
    orderNumber: 4,
    timeEstimate: '10:20 AM',
    title: 'Hymn of Praise & Assurance',
    conductedBy: 'Choir & Congregation',
    hymnRef: 'Hymn 2: It Is Well With My Soul',
    details: 'Congregational singing.',
  },
  {
    id: 'oos-5',
    orderNumber: 5,
    timeEstimate: '10:35 AM',
    title: 'Scripture Readings',
    conductedBy: '1st: Psalm 90:1-12 | 2nd: 1 Thessalonians 4:13-18',
    details: 'Read by Granddaughter & Eldest Son.',
  },
  {
    id: 'oos-6',
    orderNumber: 6,
    timeEstimate: '10:50 AM',
    title: 'Choir Special Ministration',
    conductedBy: 'Vine Branch Mass Choir',
    details: '"The Hallelujah Chorus" & "Gbo Ohun T’Olorun Wi".',
  },
  {
    id: 'oos-7',
    orderNumber: 7,
    timeEstimate: '11:05 AM',
    title: 'Biography & Selected Tributes',
    conductedBy: 'Family Representative & Church Elders',
    details: 'Reading of the life and legacy of Pa Peter Abiodun Oyenuga.',
  },
  {
    id: 'oos-8',
    orderNumber: 8,
    timeEstimate: '11:25 AM',
    title: 'Funeral Sermon & Message of Hope',
    conductedBy: 'The Senior Pastor',
    details: 'Theme: "A Life Rooted in Eternity" (2 Timothy 4:7-8).',
  },
  {
    id: 'oos-9',
    orderNumber: 9,
    timeEstimate: '11:55 AM',
    title: 'Prayers for the Family & Nation',
    conductedBy: 'Officiating Ministers',
    details: 'Special prayer for the widow, children, grandchildren and extended family.',
  },
  {
    id: 'oos-10',
    orderNumber: 10,
    timeEstimate: '12:10 PM',
    title: 'Vote of Thanks & Announcements',
    conductedBy: 'Engr. Babatunde Oyenuga',
    details: 'Appreciation on behalf of the Oyenuga and extended families.',
  },
  {
    id: 'oos-11',
    orderNumber: 11,
    timeEstimate: '12:20 PM',
    title: 'Recessional Hymn & Benediction',
    conductedBy: 'Congregation & Ministers',
    hymnRef: 'Hymn 3: Abide With Me',
    details: 'Proceeding to private interment.',
  },
];

export const defaultHymns: HymnItem[] = [
  {
    id: 'hymn-1',
    number: 'HYMN 01',
    title: 'Great Is Thy Faithfulness',
    hymnAuthor: 'Thomas O. Chisholm (1923)',
    category: 'Processional',
    lyrics: [
      '1. Great is Thy faithfulness, O God my Father,\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.',
      'Refrain:\nGreat is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided—\nGreat is Thy faithfulness, Lord, unto me!',
      '2. Summer and winter, and springtime and harvest,\nSun, moon and stars in their courses above,\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love.',
      '3. Pardon for sin and a peace that endureth,\nThine own dear presence to cheer and to guide;\nStrength for today and bright hope for tomorrow,\nBlessings all mine, with ten thousand beside!',
    ],
  },
  {
    id: 'hymn-2',
    number: 'HYMN 02',
    title: 'It Is Well With My Soul',
    hymnAuthor: 'Horatio G. Spafford (1873)',
    category: 'Assurance',
    lyrics: [
      '1. When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.',
      'Refrain:\nIt is well (it is well)\nWith my soul (with my soul)\nIt is well, it is well with my soul.',
      '2. Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ has regarded my helpless estate,\nAnd hath shed His own blood for my soul.',
      '3. And Lord, haste the day when my faith shall be sight,\nThe clouds be rolled back as a scroll;\nThe trump shall resound, and the Lord shall descend,\nEven so, it is well with my soul.',
    ],
  },
  {
    id: 'hymn-3',
    number: 'HYMN 03',
    title: 'Abide With Me',
    hymnAuthor: 'Henry F. Lyte (1847)',
    category: 'Recessional',
    lyrics: [
      '1. Abide with me: fast falls the eventide;\nThe darkness deepens; Lord, with me abide:\nWhen other helpers fail and comforts flee,\nHelp of the helpless, O abide with me.',
      '2. Swift to its close ebbs out life’s little day;\nEarth’s joys grow dim, its glories pass away;\nChange and decay in all around I see:\nO Thou who changest not, abide with me.',
      '3. Hold Thou Thy cross before my closing eyes;\nShine through the gloom, and point me to the skies:\nHeaven’s morning breaks, and earth’s vain shadows flee;\nIn life, in death, O Lord, abide with me.',
    ],
  },
  {
    id: 'hymn-4',
    number: 'HYMN 04',
    title: 'Rock of Ages, Cleft for Me',
    hymnAuthor: 'Augustus Toplady (1776)',
    category: 'Interment',
    lyrics: [
      '1. Rock of Ages, cleft for me,\nLet me hide myself in Thee;\nLet the water and the blood,\nFrom Thy wounded side which flowed,\nBe of sin the double cure,\nSave from wrath and make me pure.',
      '2. While I draw this fleeting breath,\nWhen mine eyes shall close in death,\nWhen I soar through tracts unknown,\nSee Thee on Thy judgment throne,\nRock of Ages, cleft for me,\nLet me hide myself in Thee.',
    ],
  },
];

export const defaultPhotos: PhotoMemory[] = [
  {
    id: 'photo-1',
    title: 'Pa Peter in Traditional Regal Attire',
    caption: 'Radiant celebration during his 70th Birthday Thanksgiving Service in Ibadan.',
    category: 'Celebration',
    year: '2023',
    imageUrl: portraitDefault,
  },
  {
    id: 'photo-2',
    title: 'Golden Years & Ethereal Blessing',
    caption: 'A cherished moment surrounded by peace and golden memories.',
    category: 'Youth & Milestones',
    year: '2024',
    imageUrl: cloudsDefault,
  },
  {
    id: 'photo-3',
    title: 'Church Fellowship & Dedication',
    caption: 'Serving with joy and faith at Vine Branch Church Apata.',
    category: 'Service & Faith',
    year: '2021',
    imageUrl: portraitDefault,
  },
  {
    id: 'photo-4',
    title: 'Family Thanksgiving Gathering',
    caption: 'Surrounded by children and grandchildren in joyful fellowship.',
    category: 'Family',
    year: '2022',
    imageUrl: portraitDefault,
  },
];

export const defaultMilestones: LifeMilestone[] = [
  {
    year: '1953',
    title: 'A Blessed Beginning',
    description:
      'Born in Ijebu-Ode to the noble Oyenuga family, showing early brilliance, discipline, and kindness.',
  },
  {
    year: '1975',
    title: 'Academic & Professional Excellence',
    description:
      'Graduated with honors in Agricultural Economics, dedicating decades to national agricultural development and trade.',
  },
  {
    year: '1978',
    title: 'Holy Matrimony & Family Foundation',
    description:
      'United in Christian marriage with his beloved wife Folashade, a blissful union blessed with wonderful children and grandchildren.',
  },
  {
    year: '1995',
    title: 'Pillar of Church & Community Leadership',
    description:
      'Ordained as an elder and dedicated supporter of Vine Branch Church, spearheading community scholarships and outreach.',
  },
  {
    year: '2023',
    title: 'Platinum Jubilee (70 Years) Celebration',
    description:
      'Celebrated 70 glorious years surrounded by hundreds of family, friends, and mentees from across the globe.',
  },
  {
    year: '2024',
    title: 'Peaceful Transition to Glory',
    description:
      'Called home to be with the Lord at the blessed age of 71, leaving behind a timeless legacy of love, honor, and faith.',
  },
];
