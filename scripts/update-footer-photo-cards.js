const fs = require('fs');
const file = 'src/app/components/Footer.jsx';
let text = fs.readFileSync(file, 'utf8');
const tick = String.fromCharCode(96);

const iconIndex = text.indexOf('{ icon: "/assets/images/home/event_icon.svg"');
const start = text.lastIndexOf('          {[', iconIndex);
const endMarker = '          ))}';
const end = text.indexOf(endMarker, iconIndex);
if (iconIndex === -1 || start === -1 || end === -1) {
  throw new Error(`Footer quick link map block not found. iconIndex=${iconIndex} start=${start} end=${end}`);
}

const lines = [
'          {[',
'            {',
'              image: "https://media.aerosportsparks.ca/home-experience/birthday-parties.webp",',
'              text: "Birthday Parties",',
'              url: ' + tick + '/${location_slug}/kids-birthday-parties' + tick + ',',
'            },',
'            {',
'              image: "https://media.aerosportsparks.ca/home-experience/gallery.webp",',
'              text: "Gallery",',
'              url: ' + tick + '/${location_slug}/${galleryData?.[0]?.path || \'gallery\'}' + tick + ',',
'            },',
'            {',
'              image: "https://media.aerosportsparks.ca/home-experience/group-events.webp",',
'              text: "Group Events",',
'              url: ' + tick + '/${location_slug}/${groupsData?.[0]?.path || \'groups-events\'}' + tick + ',',
'            },',
'          ].map((item, index) => (',
'            <Link href={item.url} key={index} className="v11_footer_quicklink_card v11_footer_quicklink_photo_card">',
'              <AppImage',
'                src={item.image}',
'                alt={item.text}',
'                fill',
'                sizes="(max-width: 768px) 100vw, 33vw"',
'                className="v11_footer_quicklink_photo"',
'              />',
'              <span className="v11_footer_quicklink_overlay" />',
'              <span className="v11_footer_quicklink_text">{item.text}</span>',
'            </Link>',
'          ))}',
];
const replacement = lines.join('\n');
text = text.slice(0, start) + replacement + text.slice(end + endMarker.length);
fs.writeFileSync(file, text, 'utf8');
console.log('Updated footer quick links to photo cards.');
