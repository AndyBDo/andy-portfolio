import {experience,projects} from './data';
const notes={
  CodeLens:['Links web components to backend code and documentation.','Helps interns understand unfamiliar codebases without leaving the browser.'],
  Lambda:['Keeps AI conversations going beyond model context limits.','Supports streaming replies, images, and saved chats.'],
  Loci:['Turns text and PDFs into 3D memory palaces.','Lets students explore concepts as objects in interactive rooms.'],
  SafeStep:['Finds safer routes to a destination.','Uses crowdsourced images to spot hazards like potholes and ice.'],
  Alloc:['Helps teams understand and control company spending.','Connects forecasts, spending policies, and human approval for major decisions.'],
  PokerCaml:['A multiplayer poker game played in the terminal.','Supports four or more players, betting, winner detection, and multiple rounds.'],
  Fiserv:[
    'Moved payment services to Kubernetes for easier scaling and releases.',
    'Automated onboarding alerts for 20,000+ sales partners.',
    'Secured payment and signup tools with stronger access controls.',
  ],
  'Lancaster Lebanon IU13':[
    'Built referral apps to help 3,800+ preschoolers access early-intervention services.',
    'Organized 7,000+ student and family records.',
    'Streamlined referral forms and staff workflows.',
  ],
  'Cornell Data Science':[
    'Lead a five-person team building an assistant to explore 138 club repositories.',
    'Set up GPU workflows for model training and inference.',
    'Research how digital watermarks survive AI image edits.',
  ],
};
export function experienceBook(app,index,page='work'){
  const entries=page==='projects'?projects:experience;
  const item=entries[index];if(!item){location.hash=page;return;}
  app.innerHTML=`<section class="experience-book-screen" aria-label="${page==='projects'?'Project':'Experience'} book"><div class="experience-book"><div class="book-paper"><div class="book-page-number">Page ${index+1} of ${entries.length}</div><h1 tabindex="-1">${item.title}</h1><p class="book-role">${page==='projects'?item.date:item.role}</p><ul>${notes[item.title].map(note=>`<li>${note}</li>`).join('')}</ul></div><nav class="book-navigation" aria-label="Book pages">${index>0?`<button class="book-page-arrow previous" aria-label="Previous ${page==='projects'?'project':'experience'}" data-action="${page}/${index-1}"></button>`:''}${index<entries.length-1?`<button class="book-page-arrow next" aria-label="Next ${page==='projects'?'project':'experience'}" data-action="${page}/${index+1}"></button>`:''}</nav></div><button class="book-done" data-action="${page}">Done</button></section>`;
  app.querySelector('h1').focus({preventScroll:true});
}
