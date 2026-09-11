export const entries = [
  {
    id: 'first-light',
    title: 'First Light, Calle Real',
    place: 'Intramuros',
    city: 'Manila',
    date: '05 March',
    time: '06:12',
    plate: require('../../assets/art/plate-first-light.png'),
    tags: ['Golden hour', 'Stone', 'Doorway'],
    summary: 'Sun clears the east wall and lands in a single hot band across the corridor.',
    body: [
      'For about eleven minutes the sun sits low enough to enter the corridor end-on. It crosses the floor, climbs the far wall, and then it is gone - the whole event is over before the street outside is properly awake.',
      'The light is doing all the drawing here. The architecture is only the thing it falls on: a doorway, a worn threshold, a wall that has been repainted enough times to have gone soft at the corners.',
      'Metered for the highlight and let the rest go. Anything that holds detail in the shadows loses the thing that made it worth stopping for.',
    ],
    readings: [
      { label: 'Time of day', value: '06:12 - 06:23' },
      { label: 'Direction', value: 'East, low angle' },
      { label: 'Surface', value: 'Lime-washed stone' },
      { label: 'Contrast', value: 'Extreme' },
    ],
  },
  {
    id: 'concrete-noon',
    title: 'Concrete at Noon',
    place: 'Cultural Center',
    city: 'Pasay',
    date: '11 March',
    time: '12:40',
    plate: require('../../assets/art/plate-concrete-noon.png'),
    tags: ['Brutalist', 'Overhead', 'Grey'],
    summary: 'Overhead sun turns a ribbed facade into a set of flat vertical tones.',
    body: [
      'Noon is supposed to be the hour you avoid. On board-formed concrete it is the opposite: the sun is directly above, the ribs cast almost nothing, and the wall collapses into a row of flat greys separated by hairlines.',
      'What is left is proportion. Without shadow to describe the depth, the only thing the eye can read is the rhythm of the bays - which is exactly what the building was arguing about in the first place.',
    ],
    readings: [
      { label: 'Time of day', value: '12:40' },
      { label: 'Direction', value: 'Overhead' },
      { label: 'Surface', value: 'Board-formed concrete' },
      { label: 'Contrast', value: 'Low' },
    ],
  },
  {
    id: 'terracotta-stair',
    title: 'Terracotta Stair',
    place: 'Escolta',
    city: 'Manila',
    date: '18 March',
    time: '16:05',
    plate: require('../../assets/art/plate-terracotta-stair.png'),
    tags: ['Rake', 'Warm', 'Repetition'],
    summary: 'Late sun rakes across a flight of steps and separates every tread.',
    body: [
      'A stair is the easiest subject in the city at four in the afternoon. The light arrives almost parallel to the treads, so each step gets a lit face and a dark riser, and the whole flight turns into a striped diagram of itself.',
      'Stand far enough back that the steps compress. Up close it is a stair; from thirty metres it is a pattern, and the pattern is the better photograph.',
    ],
    readings: [
      { label: 'Time of day', value: '16:05' },
      { label: 'Direction', value: 'West, raking' },
      { label: 'Surface', value: 'Clay tile' },
      { label: 'Contrast', value: 'High' },
    ],
  },
  {
    id: 'blue-hour',
    title: 'Blue Hour, Roxas',
    place: 'Roxas Boulevard',
    city: 'Manila',
    date: '02 April',
    time: '18:31',
    plate: require('../../assets/art/plate-blue-hour.png'),
    tags: ['Dusk', 'Sodium', 'Long'],
    summary: 'The twenty minutes where the sky and the street lamps read at the same value.',
    body: [
      'Blue hour is short and it is the only time the sky and the sodium lamps balance. Ten minutes early the sky wins and the lamps look weak; ten minutes late the sky is black and the lamps blow out.',
      'The trick is to arrive an hour before and do nothing. By the time the balance arrives you should already be pointed at the thing you came for.',
    ],
    readings: [
      { label: 'Time of day', value: '18:31 - 18:52' },
      { label: 'Direction', value: 'West, ambient' },
      { label: 'Surface', value: 'Wet asphalt' },
      { label: 'Contrast', value: 'Moderate' },
    ],
  },
  {
    id: 'atrium',
    title: 'Atrium, Overcast',
    place: 'Ayala Triangle',
    city: 'Makati',
    date: '09 April',
    time: '10:20',
    plate: require('../../assets/art/plate-atrium.png'),
    tags: ['Diffuse', 'Pale', 'Volume'],
    summary: 'Cloud turns the whole roof into one enormous soft light.',
    body: [
      'Overcast gets written off as flat. Under a glazed roof it is the best light in the building: the cloud layer becomes a softbox the size of the ceiling, and the volume reads through gentle gradient instead of hard edge.',
      'Look for the darkest corner and expose for that. The gradient from the roof down to the floor is the entire subject.',
    ],
    readings: [
      { label: 'Time of day', value: '10:20' },
      { label: 'Direction', value: 'Above, diffuse' },
      { label: 'Surface', value: 'Plaster, pale stone' },
      { label: 'Contrast', value: 'Very low' },
    ],
  },
  {
    id: 'ember-window',
    title: 'Ember Window',
    place: 'Binondo',
    city: 'Manila',
    date: '21 April',
    time: '19:48',
    plate: require('../../assets/art/plate-ember-window.png'),
    tags: ['Night', 'Single source', 'Warm'],
    summary: 'One lit window in a dark elevation, and nothing else in the frame.',
    body: [
      'After dark a facade is not a facade, it is a black field with a few holes punched in it. Find an elevation with exactly one window lit and the composition has already been made for you.',
      'Expose for the window, not the wall. The wall is not the subject - the wall is the margin the subject is printed on.',
    ],
    readings: [
      { label: 'Time of day', value: '19:48' },
      { label: 'Direction', value: 'Interior, single source' },
      { label: 'Surface', value: 'Painted render' },
      { label: 'Contrast', value: 'Extreme' },
    ],
  },
];

export function entryById(id) {
  return entries.find((entry) => entry.id === id);
}

/** The entry after `id`, wrapping around at the end of the collection. */
export function nextEntry(id) {
  const index = entries.findIndex((entry) => entry.id === id);
  return entries[(index + 1) % entries.length];
}

export const profile = {
  name: 'Marc Ejay Cortes',
  handle: 'Im a normal Cs Student please...',
  email: 'marc.cortes@students.cs41a.edu',
  avatar: require('../../assets/art/avatar.png'),
  stats: [
    { value: '06', label: 'Studies' },
    { value: '04', label: 'Districts' },
    { value: '12', label: 'Weeks' },
  ],
  details: [
    { label: 'Course', value: 'BSCS' },
    { label: 'Section', value: 'CS41A' },
    { label: 'Subject', value: 'CS Major Elective 3' },
    { label: 'Submission', value: 'Preliminary Project' },
  ],
  kit: ['35mm', 'Handheld', 'Available light', 'No flash', 'Warm cast'],
};
