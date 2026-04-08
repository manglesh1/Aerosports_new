function updateOpenJumpSEO() {
  var ss = SpreadsheetApp.openById('1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c');
  var sheet = ss.getSheetByName('Data');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var pathCol = headers.indexOf('path');
  var locCol = headers.indexOf('location');
  var s1Col = headers.indexOf('section1');

  var updates = getOpenJumpContent();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var path = String(data[i][pathCol]).toLowerCase();
    var loc = String(data[i][locCol]).toLowerCase().trim();
    if (path === 'open-jump' && updates[loc]) {
      sheet.getRange(i + 1, s1Col + 1).setValue(updates[loc]);
      Logger.log('Updated open-jump section1 for: ' + loc + ' (row ' + (i+1) + ')');
      count++;
    }
  }
  Logger.log('Total updated: ' + count);
}

function getOpenJumpContent() {
  return {
    'st-catharines': '<div style="max-width:900px;margin:0 auto;padding:2.5rem 1.5rem;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;color:#e0e0e0;line-height:1.7;">' +
      '<h2 style="font-size:2rem;font-weight:900;color:#ffffff;margin-bottom:0.5rem;text-transform:uppercase;">Open Jump at <span style="color:#ff1152;">AeroSports St. Catharines</span></h2>' +
      '<p style="font-size:1rem;color:#b0b0b0;margin-bottom:1.5rem;">The Niagara Region\'s top destination for freestyle trampolining and high-energy indoor fun.</p>' +
      '<p>Step into the <strong style="color:#39FF14;">open jump zone</strong> at AeroSports St. Catharines and experience the thrill of wall-to-wall interconnected trampolines. Whether you\'re a first-time bouncer or a seasoned flipper, our expansive trampoline arena is designed to deliver non-stop excitement for every age and skill level.</p>' +
      '<p>Our open jump area spans thousands of square feet of professional-grade trampolines, giving you all the room you need to perfect your aerial tricks, play bounce games with friends, or simply let loose after a long week. Located in the heart of the Niagara Region, AeroSports St. Catharines makes it easy for families from Niagara Falls, Welland, Thorold, and surrounding communities to enjoy world-class trampoline entertainment.</p>' +
      '<h3 style="font-size:1.3rem;font-weight:800;color:#ffffff;margin-top:2rem;margin-bottom:0.75rem;">Why You\'ll Love Open Jump</h3>' +
      '<ul style="list-style:none;padding:0;margin-bottom:1.5rem;">' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#9889; <strong style="color:#ffffff;">Massive Trampoline Arena</strong> &mdash; Interconnected trampolines stretching across the entire floor for maximum airtime</li>' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#127947; <strong style="color:#ffffff;">All Ages &amp; Skill Levels</strong> &mdash; Safe, supervised fun whether you\'re 3 or 53, beginner or advanced</li>' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#128170; <strong style="color:#ffffff;">Full-Body Workout</strong> &mdash; Burn calories, build core strength, and boost coordination while having a blast</li>' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#127881; <strong style="color:#ffffff;">Perfect for Groups</strong> &mdash; Great for birthday parties, team outings, school trips, and family fun days</li>' +
      '<li style="padding:0.5rem 0;">&#128171; <strong style="color:#ffffff;">Trained Staff On-Site</strong> &mdash; Our certified team ensures a safe, clean, and enjoyable environment at all times</li>' +
      '</ul>' +
      '<p>Open jump sessions at AeroSports St. Catharines are available throughout the week with flexible time slots to fit your schedule. Grab your grip socks, sign your waiver online ahead of time, and get ready to soar! Walk-ins are welcome, but we recommend <a href="https://ecom.roller.app/aerosportsstcatharines/products/en/home" style="color:#39FF14;text-decoration:underline;">booking online</a> to guarantee your preferred time slot.</p>' +
      '<div style="margin-top:2rem;text-align:center;">' +
      '<a href="https://ecom.roller.app/aerosportsstcatharines/products/en/home" style="display:inline-block;padding:0.9rem 2.5rem;background:#ff1152;color:#fff;text-decoration:none;font-weight:900;text-transform:uppercase;font-size:1rem;border-radius:8px;transition:background 0.2s;">Book Your Jump Now &rarr;</a>' +
      '</div>' +
      '</div>',

    'windsor': '<div style="max-width:900px;margin:0 auto;padding:2.5rem 1.5rem;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;color:#e0e0e0;line-height:1.7;">' +
      '<h2 style="font-size:2rem;font-weight:900;color:#ffffff;margin-bottom:0.5rem;text-transform:uppercase;">Open Jump at <span style="color:#ff1152;">AeroSports Windsor</span></h2>' +
      '<p style="font-size:1rem;color:#b0b0b0;margin-bottom:1.5rem;">Windsor-Essex\'s premier indoor trampoline experience for families, friends, and thrill-seekers.</p>' +
      '<p>Get ready to bounce, flip, and fly at the <strong style="color:#39FF14;">open jump zone</strong> inside AeroSports Windsor! Our massive trampoline arena features wall-to-wall interconnected trampolines where jumpers of every age can enjoy freestyle bouncing in a safe, supervised environment.</p>' +
      '<p>Whether you\'re looking for an exciting weekend activity, a unique way to stay active, or the perfect spot for your next group outing, open jump at AeroSports Windsor delivers an unforgettable experience. Families from across Windsor, Tecumseh, LaSalle, Amherstburg, and the entire Essex County area love our park for its clean facilities, friendly staff, and non-stop entertainment.</p>' +
      '<h3 style="font-size:1.3rem;font-weight:800;color:#ffffff;margin-top:2rem;margin-bottom:0.75rem;">Why You\'ll Love Open Jump</h3>' +
      '<ul style="list-style:none;padding:0;margin-bottom:1.5rem;">' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#9889; <strong style="color:#ffffff;">Expansive Bounce Zone</strong> &mdash; Thousands of square feet of connected trampolines for endless airtime and tricks</li>' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#127947; <strong style="color:#ffffff;">Fun for All Ages</strong> &mdash; Toddlers to adults, everyone can jump at their own pace in a safe setting</li>' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#128170; <strong style="color:#ffffff;">Active Entertainment</strong> &mdash; A high-energy alternative to screens that builds strength, balance, and confidence</li>' +
      '<li style="padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.08);">&#127881; <strong style="color:#ffffff;">Ideal for Events</strong> &mdash; Host birthday parties, corporate team-building events, or school field trips with ease</li>' +
      '<li style="padding:0.5rem 0;">&#128171; <strong style="color:#ffffff;">Safety First</strong> &mdash; Professional staff, padded surfaces, and strict safety protocols for your peace of mind</li>' +
      '</ul>' +
      '<p>AeroSports Windsor offers flexible open jump sessions throughout the week, so you can find the perfect time that works for your crew. Don\'t forget to sign your waiver online before you arrive to skip the line! Walk-ins are always welcome, but <a href="https://ecom.roller.app/aerosportswindsor/products/en/home" style="color:#39FF14;text-decoration:underline;">booking ahead online</a> guarantees your spot during busy times.</p>' +
      '<div style="margin-top:2rem;text-align:center;">' +
      '<a href="https://ecom.roller.app/aerosportswindsor/products/en/home" style="display:inline-block;padding:0.9rem 2.5rem;background:#ff1152;color:#fff;text-decoration:none;font-weight:900;text-transform:uppercase;font-size:1rem;border-radius:8px;transition:background 0.2s;">Book Your Jump Now &rarr;</a>' +
      '</div>' +
      '</div>'
  };
}