// The sample songs (product spec songs.md, "Sample songs"): four public-domain songs
// with chords, shown on the first start. In M1 they are the only songs.
// The text uses the provisional "chords over lyrics" form (see domain/songs.js).

/** @type {import('../domain/songs.js').Song[]} */
export const SAMPLE_SONGS = [
  {
    id: 'sample-amazing-grace',
    title: 'Amazing Grace',
    artist: 'Traditional',
    key: 'G',
    text: [
      'G              G7        C       G',
      'Amazing grace, how sweet the sound',
      'G                    D',
      'That saved a wretch like me',
      'G            G7         C        G',
      'I once was lost, but now am found',
      'G           D        G',
      'Was blind, but now I see',
    ].join('\n'),
  },
  {
    id: 'sample-house-of-the-rising-sun',
    title: 'House of the Rising Sun',
    artist: 'Traditional',
    key: 'Am',
    text: [
      '   Am      C        D          F',
      'There is a house in New Orleans',
      '   Am       C         E',
      'They call the Rising Sun',
      '     Am       C        D        F',
      "And it's been the ruin of many a poor boy",
      '    Am      E        Am',
      "And God, I know I'm one",
    ].join('\n'),
  },
  {
    id: 'sample-greensleeves',
    title: 'Greensleeves',
    artist: 'Traditional',
    key: 'Em',
    text: [
      '   Em          D',
      'Alas, my love, you do me wrong',
      '  Em            B7',
      'To cast me off discourteously',
      '   Em            D',
      'For I have loved you well and long',
      '    Em     B7       Em',
      'Delighting in your company',
    ].join('\n'),
  },
  {
    id: 'sample-when-the-saints',
    title: 'When the Saints Go Marching In',
    artist: 'Traditional',
    key: 'C',
    text: [
      'C',
      'Oh, when the saints go marching in',
      '                         G',
      'Oh, when the saints go marching in',
      '     C          C7        F',
      'Oh Lord, I want to be in that number',
      '     C          G         C',
      'When the saints go marching in',
    ].join('\n'),
  },
];
