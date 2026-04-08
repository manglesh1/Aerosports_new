/**
 * Script to update thin attraction page content in Google Sheets
 * Run: node update-content.js
 */
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./src/app/api/sheet/service-account-creds.json');

const SPREADSHEET_ID = '1B_9EaTQDztWGH_cD3lUP7hpWD6FvNBJ-6Czml2x7d9c';

const BOOKING_URLS = {
  oakville: 'https://ecom.roller.app/aerosportsoakvillemississauga/products/en/home',
  'st-catharines': 'https://ecom.roller.app/aerosportsstcatharines/products/en/home',
  london: 'https://ecom.roller.app/aerosportslondon/londoncheckout/en/home',
  windsor: 'https://ecom.roller.app/aerosportswindsor/products/en/home',
  scarborough: 'https://ecom.roller.app/aerosportsscarborough/products/en/home',
};

const LOCATION_NAMES = {
  oakville: 'Oakville',
  london: 'London',
  windsor: 'Windsor',
  'st-catharines': 'St. Catharines',
  scarborough: 'Scarborough',
};

function makeContent(location, path, bookUrl, locationName) {
  const base = `https://www.aerosportsparks.ca/${location}`;

  const pages = {
    // ============ LONDON OPEN JUMP (row 41) ============
    'london/open-jump': `<div class="container">
    <h2>Open Jump at AeroSports ${locationName}</h2>

    <h2>Bounce, Flip &amp; Soar on Wall-to-Wall Trampolines</h2>
    <p>Welcome to <span class="highlight">Open Jump</span> at AeroSports ${locationName} — our signature attraction and the heart of the park! Step onto our massive interconnected trampoline floor and experience the freedom of bouncing in every direction. Whether you're practising your flips, playing aerial games with friends, or simply bouncing for joy, Open Jump delivers non-stop fun for every age and skill level.</p>

    <h2>What Is Open Jump?</h2>
    <p>Open Jump gives you full access to our expansive trampoline arena, featuring wall-to-wall trampolines, angled wall trampolines for off-the-wall tricks, and dedicated zones for different skill levels. Our interconnected design means you can bounce freely across the entire floor — no waiting, no limits, just pure airborne excitement.</p>

    <h2>Why Families Love Open Jump</h2>
    <ul>
        <li><strong>All Ages Welcome:</strong> From toddlers taking their first bounce to teens perfecting backflips, our trampolines cater to everyone.</li>
        <li><strong>Full-Body Workout:</strong> Jumping on trampolines burns calories, strengthens muscles, and improves coordination — all while having a blast.</li>
        <li><strong>Safe Environment:</strong> Padded surfaces, trained staff, and clear safety guidelines ensure a worry-free experience for parents and jumpers alike.</li>
        <li><strong>Social &amp; Active Fun:</strong> Perfect for playdates, family outings, birthday celebrations, and group events.</li>
        <li><strong>Angled Wall Trampolines:</strong> Run up the walls and defy gravity with our unique angled trampoline sections.</li>
    </ul>

    <h2>Perfect for Every Occasion</h2>
    <p>Open Jump is ideal for birthday parties, school trips, corporate team-building, or simply a fun afternoon out. Combine it with our other attractions like dodgeball, slam basketball, and ninja warrior for the ultimate AeroSports experience!</p>

    <h2>Book Your Jump Session</h2>
    <p>Ready to get airborne? Check our <a href="${bookUrl}">schedule</a> for Open Jump session times and book your visit today. Walk-ins are welcome, but we recommend reserving online to guarantee your preferred time slot.</p>
    <p>For pricing details, visit our <a href="${base}/pricing-promos">pricing and promotions page</a>.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ HEXAQUEST (st-catharines row 42, windsor row 44) ============
    'hexaquest': `<div class="container">
    <h2>Hexaquest at AeroSports ${locationName}</h2>

    <h2>Your Favourite Carnival Game — Gone Digital!</h2>
    <p>Step up to <span class="highlight">Hexaquest</span> at AeroSports ${locationName} — an exciting digital target game that tests your accuracy, speed, and competitive spirit! Throw balls at illuminated targets to rack up points, advance through levels, and compete for the highest score. It's the classic carnival experience reimagined with cutting-edge technology.</p>

    <h2>How Hexaquest Works</h2>
    <p>Each player faces a wall of hexagonal targets that light up in sequence. Your mission: hit the glowing targets with the provided balls as quickly and accurately as possible. Every successful hit adds to your score and unlocks the next level, with increasing speed and difficulty. Miss too many, and your run ends — so stay sharp and keep throwing!</p>

    <h2>Why You'll Love Hexaquest</h2>
    <ul>
        <li><strong>Addictively Fun:</strong> The combination of speed, accuracy, and rising difficulty makes Hexaquest impossible to play just once.</li>
        <li><strong>All Ages &amp; Skill Levels:</strong> Whether you're 6 or 60, the intuitive gameplay is easy to pick up but hard to master.</li>
        <li><strong>Competitive Edge:</strong> Challenge friends and family to see who can reach the highest level and top the leaderboard.</li>
        <li><strong>Hand-Eye Coordination:</strong> Sharpen your reflexes and improve your throwing accuracy with every round.</li>
        <li><strong>Quick &amp; Exciting:</strong> Each round is fast-paced, making it perfect to squeeze in between other attractions.</li>
    </ul>

    <h2>Perfect Add-On to Your Visit</h2>
    <p>Hexaquest is a fantastic complement to our other attractions. After bouncing on the trampolines or conquering the ninja course, test your aim and see if you can beat the top score. It's also a great option for birthday parties and group events — add a competitive challenge that everyone can enjoy!</p>

    <h2>Try Hexaquest Today</h2>
    <p>Ready to test your aim? Visit AeroSports ${locationName} and take on the Hexaquest challenge. Check our <a href="${bookUrl}">booking page</a> to plan your visit, or stop by and jump right in!</p>
    <p>For pricing information, visit our <a href="${base}/pricing-promos">pricing and promotions page</a>.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ ST-CATHARINES OPEN JUMP (row 46) ============
    'st-catharines/open-jump': `<div class="container">
    <h2>Open Jump at AeroSports ${locationName}</h2>

    <h2>Bounce Into Endless Fun on Our Trampolines</h2>
    <p>Experience the thrill of <span class="highlight">Open Jump</span> at AeroSports ${locationName}! Our massive interconnected trampoline arena is the centrepiece of the park, offering wall-to-wall bouncing excitement for kids, teens, and adults. Flip, bounce, and soar across our expansive floor — there's room for everyone to enjoy high-flying fun!</p>

    <h2>What Makes Our Open Jump Special</h2>
    <p>Our Open Jump area features interconnected trampolines stretching across the entire floor, plus angled wall trampolines that let you run up the walls and defy gravity. With separate zones for different ages and skill levels, everyone from first-time bouncers to experienced aerialists can jump safely and have a blast.</p>

    <h2>Why Families Choose Open Jump</h2>
    <ul>
        <li><strong>Safe for All Ages:</strong> Padded edges, trained supervisors, and age-appropriate zones keep everyone safe.</li>
        <li><strong>Incredible Exercise:</strong> Trampolining is one of the most effective cardio workouts — and the most fun way to stay active.</li>
        <li><strong>Endless Entertainment:</strong> With so much space, there's always room to try new tricks, play games, or simply bounce to your heart's content.</li>
        <li><strong>Great for Groups:</strong> From birthday parties to school trips and corporate outings, Open Jump is the perfect group activity.</li>
        <li><strong>Wall Trampolines:</strong> Take your skills to new heights — literally — on our angled wall-mounted trampolines.</li>
    </ul>

    <h2>Combine With Other Attractions</h2>
    <p>Open Jump is just the beginning! Pair it with our dodgeball courts, battle beam, ninja warrior course, and more for a full day of action-packed entertainment at AeroSports ${locationName}.</p>

    <h2>Reserve Your Spot</h2>
    <p>Don't miss out on the fun — <a href="${bookUrl}">book your Open Jump session online</a> or walk in any time during park hours. Check our <a href="${base}/pricing-promos">pricing page</a> for session rates and combo deals.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ ST-CATHARINES ARCHERY (row 48) ============
    'st-catharines/archery': `<div class="container">
    <h2>Archery at AeroSports ${locationName}</h2>

    <h2>Aim Like the Pros — With Real Bows &amp; Arrows!</h2>
    <p>Channel your inner archer at AeroSports ${locationName}! Our <span class="highlight">Indoor Archery</span> attraction is the real deal — no simulations here. Pick up a genuine bow, take aim at the targets, and watch your points climb with every bullseye. It's a thrilling test of focus, precision, and steady hands that the whole family can enjoy.</p>

    <h2>How It Works</h2>
    <p>Step up to the shooting line and receive your bow and arrows from our trained staff. Take aim at the colour-coded targets and let your arrows fly! Each ring on the target is worth different points, so accuracy is key. Challenge yourself to improve with every shot, or go head-to-head with friends and family to see who's the sharpest shooter in the group.</p>

    <h2>Why You'll Love Archery at AeroSports</h2>
    <ul>
        <li><strong>Real Equipment:</strong> Experience authentic archery with real bows and arrows in a safe, supervised indoor environment.</li>
        <li><strong>Ages 8 and Up:</strong> Perfect for kids, teens, and adults who want to try something different and exciting.</li>
        <li><strong>Build Focus &amp; Discipline:</strong> Archery improves concentration, patience, and hand-eye coordination — valuable skills for all ages.</li>
        <li><strong>Friendly Competition:</strong> Challenge your friends and family to a shooting match and crown the ultimate marksman.</li>
        <li><strong>Unique Party Activity:</strong> Add archery to your birthday party or group event for a memorable experience everyone will talk about.</li>
    </ul>

    <h2>A Unique Addition to Your Visit</h2>
    <p>After bouncing on the trampolines and conquering the ninja course, slow down your heart rate and sharpen your focus with a round of archery. It's the perfect balance of calm precision and competitive excitement, and a unique attraction you won't find at most indoor parks.</p>

    <h2>Take Your Best Shot</h2>
    <p>Ready to hit the bullseye? Visit AeroSports ${locationName} and try archery today. <a href="${bookUrl}">Book your session online</a> or check our <a href="${base}/pricing-promos">pricing page</a> for rates and packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ ST-CATHARINES AERO HOOPS (row 49) ============
    'st-catharines/aero-hoops': `<div class="container">
    <h2>Aero Hoops at AeroSports ${locationName}</h2>

    <h2>Dunk Like the Pros — With Trampoline Power!</h2>
    <p>Ever dreamed of throwing down a massive slam dunk? At AeroSports ${locationName}, <span class="highlight">Aero Hoops</span> makes it possible! Combine the spring of our trampolines with basketball hoops and experience the thrill of soaring through the air to sink incredible dunks. Whether you're a basketball fan or just love catching big air, Aero Hoops delivers an unforgettable experience.</p>

    <h2>How Aero Hoops Works</h2>
    <p>Step onto the trampoline court, grab a ball, and launch yourself toward the hoop. Our trampolines give you the extra lift you need to throw down dunks, nail alley-oops, and pull off moves you've only seen on TV. The hoops are set at various heights, so players of all sizes and skill levels can experience the joy of a perfect slam dunk.</p>

    <h2>Why You'll Love Aero Hoops</h2>
    <ul>
        <li><strong>Slam Dunk Dreams:</strong> Experience the incredible feeling of dunking a basketball with the help of trampolines — no NBA contract required!</li>
        <li><strong>All Skill Levels:</strong> Whether you're a seasoned baller or picking up a basketball for the first time, Aero Hoops is pure fun.</li>
        <li><strong>Incredible Workout:</strong> Jumping, running, and shooting combines cardio, strength training, and coordination in one exciting activity.</li>
        <li><strong>Perfect for Competition:</strong> Challenge your friends to a dunk contest or a game of trampoline basketball.</li>
        <li><strong>Great for Events:</strong> Add Aero Hoops to your birthday party or group outing for slam-dunk entertainment.</li>
    </ul>

    <h2>Combine With More Attractions</h2>
    <p>After dominating the court, explore our other attractions including Open Jump, Battle Beam, Ninja Warrior, and more. AeroSports ${locationName} has something for everyone!</p>

    <h2>Get in the Game</h2>
    <p>Ready to throw down? <a href="${bookUrl}">Book your visit online</a> and experience Aero Hoops at AeroSports ${locationName}. Check our <a href="${base}/pricing-promos">pricing page</a> for session rates and group packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ LONDON BATTLE BEAM (row 50) ============
    'london/battle-beam': `<div class="container">
    <h2>Battle Beam at AeroSports ${locationName}</h2>

    <h2>The Ultimate Test of Balance &amp; Strategy</h2>
    <p>Get ready for an epic showdown on the <span class="highlight">Battle Beam</span> at AeroSports ${locationName}! This thrilling attraction challenges you and your opponent to face off on an elevated beam, armed with padded jousting sticks. Use your balance, timing, and strategy to knock your rival into the soft foam pit below — while keeping your own footing steady!</p>

    <h2>How Battle Beam Works</h2>
    <p>Two competitors stand on opposite ends of a narrow, raised beam suspended safely over a cushioned foam pit. Each player wields a padded jousting stick. The rules are simple: use your stick to push, nudge, or unbalance your opponent until they fall off the beam. The last one standing wins! It's a fantastic mix of balance, strategy, and friendly competition that draws crowds of cheering spectators.</p>

    <h2>Why You'll Love Battle Beam</h2>
    <ul>
        <li><strong>Thrilling Competition:</strong> There's nothing quite like the rush of a head-to-head balance battle with friends or family.</li>
        <li><strong>Safe &amp; Supervised:</strong> Padded jousting sticks and a soft foam pit landing mean all the excitement with none of the worry.</li>
        <li><strong>All Ages Welcome:</strong> Kids, teens, and adults can all enjoy the Battle Beam — it's fun for the whole family.</li>
        <li><strong>Builds Core Strength:</strong> Balancing on the beam engages your core, improves coordination, and sharpens your reflexes.</li>
        <li><strong>Spectator Fun:</strong> Even watching is a blast — cheer on your friends as they wobble, dodge, and ultimately take the plunge!</li>
    </ul>

    <h2>Perfect for Parties &amp; Events</h2>
    <p>Battle Beam is a crowd favourite for birthday parties, team-building events, and group outings. Set up a tournament bracket and crown the ultimate Battle Beam champion! Pair it with our trampolines, dodgeball, and ninja course for a full day of action.</p>

    <h2>Accept the Challenge</h2>
    <p>Think you've got what it takes to stay on the beam? Visit AeroSports ${locationName} and find out! <a href="${bookUrl}">Book your session online</a> or check our <a href="${base}/pricing-promos">pricing page</a> for rates and group deals.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Your Battle</a>
    </div>
</div>`,

    // ============ LONDON DODGEBALL (row 61) ============
    'london/dodgeball': `<div class="container">
    <h2>Dodgeball at AeroSports ${locationName}</h2>

    <h2>High-Energy Action on the Trampoline Court</h2>
    <p>Get ready for heart-pounding action with <span class="highlight">Dodgeball</span> at AeroSports ${locationName}! This classic game gets an incredible upgrade when you add trampolines to the mix. Bounce, dodge, and throw your way to victory in our state-of-the-art dodgeball arena — where every jump gives you a strategic advantage and every throw counts!</p>

    <h2>How Trampoline Dodgeball Works</h2>
    <p>Two teams face off on our trampoline dodgeball court, each armed with soft foam balls. The objective: eliminate opposing players by hitting them with thrown balls while dodging incoming attacks. Use the trampolines to leap over throws, catch mid-air passes, and launch powerful strikes from above. It's dodgeball like you've never experienced before!</p>

    <h2>Why You'll Love Dodgeball at AeroSports</h2>
    <ul>
        <li><strong>Adrenaline Rush:</strong> The combination of trampolines and dodgeball creates a fast-paced, heart-pumping experience.</li>
        <li><strong>Team Building:</strong> Work with your teammates to develop strategies, protect each other, and dominate the court.</li>
        <li><strong>All Ages &amp; Abilities:</strong> Our dodgeball games accommodate different skill levels — beginners and seasoned players alike.</li>
        <li><strong>Amazing Workout:</strong> Running, jumping, throwing, and dodging gives you a full-body workout without even realizing it.</li>
        <li><strong>Unforgettable Parties:</strong> Dodgeball tournaments are one of our most popular birthday party and group event activities.</li>
    </ul>

    <h2>Great for Groups &amp; Events</h2>
    <p>Dodgeball is the perfect activity for birthday parties, corporate team-building, school outings, and friend groups. Organize a tournament, pick your teams, and battle it out for bragging rights! Our staff can help set up custom game formats for your event.</p>

    <h2>Join the Dodgeball Action</h2>
    <p>Ready to dodge, duck, dip, dive, and dodge? <a href="${bookUrl}">Book your session online</a> and experience the excitement of trampoline dodgeball at AeroSports ${locationName}. Visit our <a href="${base}/pricing-promos">pricing page</a> for rates and group packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ LONDON SLAM BASKETBALL (row 66) ============
    'london/slam-basketball': `<div class="container">
    <h2>Aero Slam at AeroSports ${locationName}</h2>

    <h2>Slam Dunk Like a Pro — Trampoline Style!</h2>
    <p>Experience the thrill of soaring through the air and throwing down incredible dunks at AeroSports ${locationName}! <span class="highlight">Aero Slam</span> combines the excitement of basketball with the power of trampolines, letting you launch yourself higher than ever to sink jaw-dropping slam dunks. Whether you're a basketball enthusiast or just looking for high-flying fun, Aero Slam is a must-try!</p>

    <h2>How Aero Slam Works</h2>
    <p>Step onto our trampoline basketball court, grab a ball, and get ready to fly. The embedded trampolines give you the explosive bounce you need to reach the hoops with ease. Practise your layups, perfect your slam dunks, and challenge friends to shooting contests. With multiple hoops at different heights, players of all ages and skill levels can experience the rush of scoring from above!</p>

    <h2>Why Aero Slam Is a Fan Favourite</h2>
    <ul>
        <li><strong>Gravity-Defying Dunks:</strong> Get the lift you need to dunk like the pros — trampolines make it possible for everyone.</li>
        <li><strong>Fun for All Skill Levels:</strong> You don't need to be a basketball star to enjoy Aero Slam — just bring your energy and competitive spirit.</li>
        <li><strong>Full-Body Workout:</strong> Jumping, shooting, and running on trampolines works your entire body while keeping the fun meter maxed out.</li>
        <li><strong>Friendly Competition:</strong> Host slam dunk contests, play H-O-R-S-E, or go head-to-head in a trampoline basketball showdown.</li>
        <li><strong>Party Favourite:</strong> Aero Slam is one of our most requested activities for birthday parties and group events.</li>
    </ul>

    <h2>More Than Just Basketball</h2>
    <p>After dominating the court, check out our other attractions including Open Jump, Ninja Warrior, Battle Beam, and more. AeroSports ${locationName} is your destination for an action-packed day of indoor entertainment.</p>

    <h2>Hit the Court</h2>
    <p>Ready to take flight? <a href="${bookUrl}">Book your visit online</a> and experience Aero Slam at AeroSports ${locationName}. Check our <a href="${base}/pricing-promos">pricing page</a> for session rates and packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ LONDON NINJA WARRIOR (row 73) ============
    'london/ninja-warrior': `<div class="container">
    <h2>Ninja Warrior at AeroSports ${locationName}</h2>

    <h2>Conquer the Ultimate Obstacle Course</h2>
    <p>Do you have what it takes to call yourself a ninja? Put your skills to the test on the <span class="highlight">Ninja Warrior</span> obstacle course at AeroSports ${locationName}! Inspired by the hit TV show, our challenging course features a series of demanding obstacles designed to test your balance, strength, agility, and mental focus. Navigate the course, beat the clock, and earn your ninja status!</p>

    <h2>What Awaits You on the Course</h2>
    <p>Our Ninja Warrior course features a variety of obstacles including balance beams, rope swings, climbing walls, monkey bars, warped walls, and more. Each obstacle presents a unique challenge that requires different skills — from upper body strength and grip endurance to quick footwork and fearless determination. The course is designed with progressive difficulty, so beginners can work through the early stages while experienced ninjas push their limits on the advanced obstacles.</p>

    <h2>Why You'll Love Ninja Warrior</h2>
    <ul>
        <li><strong>Full-Body Challenge:</strong> Every obstacle targets different muscle groups, giving you an incredible workout from start to finish.</li>
        <li><strong>All Ages Welcome:</strong> Our course accommodates kids, teens, and adults with obstacles suited to different sizes and abilities.</li>
        <li><strong>Build Confidence:</strong> Conquering each obstacle builds self-confidence, resilience, and a sense of achievement.</li>
        <li><strong>Compete &amp; Improve:</strong> Race your friends through the course or challenge yourself to beat your personal best time.</li>
        <li><strong>Supervised &amp; Safe:</strong> Trained staff supervise the course and provide guidance to help you tackle each obstacle safely.</li>
    </ul>

    <h2>Perfect for Groups &amp; Events</h2>
    <p>Ninja Warrior is an incredible activity for birthday parties, team-building events, and school outings. Set up relay races, time trials, or ninja tournaments — the possibilities are endless! Our team can help customize the experience for your group.</p>

    <h2>Begin Your Ninja Journey</h2>
    <p>Ready to take on the challenge? <a href="${bookUrl}">Book your session online</a> and conquer the Ninja Warrior course at AeroSports ${locationName}. Visit our <a href="${base}/pricing-promos">pricing page</a> for session rates and group packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ ST-CATHARINES AERO LADDER (row 74) ============
    'st-catharines/aero-ladder': `<div class="container">
    <h2>Aero Ladder at AeroSports ${locationName}</h2>

    <h2>Are You Brave Enough to Reach the Top?</h2>
    <p>Think you've got steady nerves and perfect balance? The <span class="highlight">Aero Ladder</span> at AeroSports ${locationName} dares you to prove it! This wobbly, rotating ladder challenges you to climb all the way to the top and plant your flag — but with every rung that shifts and sways beneath you, reaching the summit is far harder than it looks. Fall, and you'll tumble safely onto the cushioned landing below. The question is: will you try again?</p>

    <h2>How Aero Ladder Works</h2>
    <p>The Aero Ladder is a free-spinning ladder suspended over a soft landing area. As you climb, the ladder rotates and wobbles with every movement, making balance the key to success. Your goal is to reach the very top and ring the bell or plant the flag before gravity wins. It takes coordination, core strength, and nerves of steel — and most people fall within the first few rungs. But the sweet satisfaction of making it to the top? Absolutely worth the effort!</p>

    <h2>Why Climbers Love Aero Ladder</h2>
    <ul>
        <li><strong>Addictive Challenge:</strong> Almost nobody makes it to the top on their first try — which is exactly what keeps people coming back for more.</li>
        <li><strong>Core Strength Builder:</strong> Balancing on the rotating rungs engages your entire core, arms, and legs.</li>
        <li><strong>Safe Thrills:</strong> A cushioned landing area means you can fall without worry and jump right back on to try again.</li>
        <li><strong>All Ages Can Try:</strong> Kids and adults alike love the challenge — it's a great equalizer where size doesn't guarantee success.</li>
        <li><strong>Bragging Rights:</strong> If you make it to the top, you've earned serious bragging rights among your friends and family!</li>
    </ul>

    <h2>Perfect Party Add-On</h2>
    <p>Aero Ladder competitions are a fantastic addition to birthday parties and group events. Set up a challenge to see who can climb the highest — it's guaranteed to generate laughs, cheers, and unforgettable moments!</p>

    <h2>Take the Climb</h2>
    <p>Think you can conquer the Aero Ladder? Visit AeroSports ${locationName} and find out! <a href="${bookUrl}">Book your session online</a> or check our <a href="${base}/pricing-promos">pricing page</a> for rates.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ LONDON WARPED WALLS (row 77) ============
    'london/warped-walls': `<div class="container">
    <h2>Warped Walls at AeroSports ${locationName}</h2>

    <h2>Can You Conquer the Legendary Warped Wall?</h2>
    <p>It's the final obstacle in countless ninja competitions — and one of the most iconic challenges in the world. The <span class="highlight">Warped Wall</span> at AeroSports ${locationName} invites you to sprint full speed at a towering curved wall and launch yourself to the top. Use your momentum, timing, and explosive power to grab the ledge and pull yourself over. Do you have what it takes?</p>

    <h2>How the Warped Wall Works</h2>
    <p>The warped wall is a large, curved incline that rises steeply above the ground. To conquer it, you'll need to build up speed with a running start, then use that momentum to run up the curved surface and reach for the top edge. The unique concave shape helps propel you upward — but it also makes it extremely tricky to maintain your footing. Timing, speed, and confidence are essential. Our walls feature multiple heights, so beginners can start with the shorter wall and work their way up to the full-height challenge.</p>

    <h2>Why You'll Love the Warped Wall</h2>
    <ul>
        <li><strong>Iconic Challenge:</strong> The warped wall is legendary in ninja warrior competitions — now you can experience it yourself.</li>
        <li><strong>Multiple Heights:</strong> Start with smaller walls and progress to the tallest — there's a challenge for every skill level.</li>
        <li><strong>Explosive Power:</strong> Running and launching up the wall builds leg strength, cardiovascular fitness, and explosive athleticism.</li>
        <li><strong>Incredible Achievement:</strong> There's no feeling quite like grabbing the top of the wall and pulling yourself over for the first time.</li>
        <li><strong>Spectator Excitement:</strong> Watching friends attempt the wall is almost as entertaining as trying it yourself!</li>
    </ul>

    <h2>Part of the Ninja Experience</h2>
    <p>The Warped Wall is a highlight of our ninja-style attractions. Combine it with the full Ninja Warrior obstacle course for the complete ninja experience at AeroSports ${locationName}.</p>

    <h2>Run, Jump, Conquer</h2>
    <p>Ready to take on the wall? <a href="${bookUrl}">Book your visit online</a> and challenge yourself at AeroSports ${locationName}. Visit our <a href="${base}/pricing-promos">pricing page</a> for session rates and packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ LONDON AERO DROP (row 79) ============
    'london/aero-drop': `<div class="container">
    <h2>Aero Drop at AeroSports ${locationName}</h2>

    <h2>Take the Leap Into Our Giant Airbag!</h2>
    <p>Get ready for the ultimate thrill at AeroSports ${locationName} with <span class="highlight">Aero Drop</span>! Featuring an impressive 3,000-square-foot airbag, this attraction is perfect for anyone who wants to experience the rush of free-falling and landing safely on a massive cushion of air. Climb to the top of our jump platform, take a deep breath, and leap into an unforgettable experience!</p>

    <h2>How Aero Drop Works</h2>
    <p>Climb the stairs to our elevated jump platform, choose your launch spot, and take the plunge! As you fall, a giant inflatable airbag cushions your landing, making it completely safe and incredibly fun. Try different jump styles — cannonballs, starfish, backflips (for the brave!) — and experience the weightless thrill of free-fall every single time. The airbag is one of the largest in the region, giving you plenty of room for a soft, comfortable landing.</p>

    <h2>Why You'll Love Aero Drop</h2>
    <ul>
        <li><strong>Heart-Pumping Thrill:</strong> The moment you step off the platform, your adrenaline goes through the roof — it's an incredible rush!</li>
        <li><strong>Safe Landing:</strong> Our 3,000-square-foot airbag ensures every jump ends with a soft, safe landing.</li>
        <li><strong>All Ages &amp; Abilities:</strong> You don't need any special skills — just the courage to jump! Kids and adults alike love the experience.</li>
        <li><strong>Try New Tricks:</strong> Once you've conquered the basic jump, challenge yourself with different styles and aerial moves.</li>
        <li><strong>Conquer Your Fears:</strong> Aero Drop is an amazing way to push past your comfort zone and build confidence.</li>
    </ul>

    <h2>An Unforgettable Experience</h2>
    <p>Aero Drop is one of our most popular attractions and a must-try on every visit. Pair it with our trampolines, ninja course, and dodgeball courts for a full day of non-stop excitement at AeroSports ${locationName}.</p>

    <h2>Take the Leap</h2>
    <p>Ready to drop? <a href="${bookUrl}">Book your visit online</a> and experience the thrill of Aero Drop at AeroSports ${locationName}. Check our <a href="${base}/pricing-promos">pricing page</a> for session rates and group packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,

    // ============ SCARBOROUGH GO-KART (row 169) ============
    'scarborough/go-kart': `<div class="container">
    <h2>Go-Kart Racing at AeroSports ${locationName}</h2>

    <h2>Rev Your Engines for High-Speed Indoor Racing!</h2>
    <p>Experience the rush of <span class="highlight">Go-Kart Racing</span> at AeroSports ${locationName}! Our indoor go-kart track delivers heart-pounding speed, sharp turns, and competitive racing action for drivers of all experience levels. Whether you're a first-time racer or a seasoned speed enthusiast, our karts and track are designed for maximum fun and excitement.</p>

    <h2>What to Expect</h2>
    <p>Strap into one of our high-performance go-karts and hit the track! Our professionally designed indoor circuit features exciting twists, turns, and straightaways that test your driving skills and racing instincts. With state-of-the-art timing systems, you can track your lap times and compete against friends and family for the fastest time. Safety equipment and a full briefing are provided before every race.</p>

    <h2>Why Racers Love Our Go-Karts</h2>
    <ul>
        <li><strong>Real Racing Thrills:</strong> Our karts deliver genuine speed and handling, giving you an authentic racing experience.</li>
        <li><strong>All Skill Levels:</strong> First-timers and experienced racers alike will have a blast on our track.</li>
        <li><strong>Indoor Track:</strong> Race year-round in our climate-controlled indoor facility — no weather delays!</li>
        <li><strong>Competitive Edge:</strong> Electronic timing systems track every lap, so you can challenge friends and beat your personal best.</li>
        <li><strong>Safe &amp; Supervised:</strong> Full safety equipment, pre-race briefings, and trained marshals ensure a safe racing environment.</li>
    </ul>

    <h2>Perfect for Events &amp; Celebrations</h2>
    <p>Go-kart racing is an incredible activity for birthday parties, corporate events, team outings, and friendly competitions. Book a private race session for your group and award the champion with ultimate bragging rights! Combine with our other attractions — trampolines, dodgeball, laser tag, and more — for the ultimate AeroSports experience.</p>

    <h2>Start Your Engines</h2>
    <p>Ready to race? <a href="${bookUrl}">Book your go-kart session online</a> and experience the thrill of indoor racing at AeroSports ${locationName}. Visit our <a href="${base}/pricing-promos">pricing page</a> for rates and group packages.</p>

    <div class="image">
        <a href="${bookUrl}" class="sigma_btn-custom">Book Now</a>
    </div>
</div>`,
  };

  // Return content based on location/path or just path (for shared content like hexaquest)
  const key = `${location}/${path}`;
  return pages[key] || pages[path] || null;
}

async function main() {
  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  console.log('Connected to spreadsheet:', doc.title);

  const sheet = doc.sheetsByTitle['Data'];
  const rows = await sheet.getRows();

  // Pages to update: [rowIndex, location, path]
  const updates = [
    [41, 'london', 'open-jump'],
    [42, 'st-catharines', 'hexaquest'],
    [44, 'windsor', 'hexaquest'],
    [46, 'st-catharines', 'open-jump'],
    [48, 'st-catharines', 'archery'],
    [49, 'st-catharines', 'aero-hoops'],
    [50, 'london', 'battle-beam'],
    [61, 'london', 'dodgeball'],
    [66, 'london', 'slam-basketball'],
    [73, 'london', 'ninja-warrior'],
    [74, 'st-catharines', 'aero-ladder'],
    [77, 'london', 'warped-walls'],
    [79, 'london', 'aero-drop'],
    [169, 'scarborough', 'go-kart'],
  ];

  let updated = 0;
  let failed = 0;

  for (const [rowIdx, location, path] of updates) {
    const row = rows[rowIdx];
    if (!row) {
      console.error(`Row ${rowIdx} not found!`);
      failed++;
      continue;
    }

    // Verify this is the right row
    const rowLocation = row.get('location');
    const rowPath = row.get('path');
    if (rowLocation !== location || rowPath !== path) {
      console.error(`Row ${rowIdx} mismatch! Expected ${location}/${path}, got ${rowLocation}/${rowPath}`);
      failed++;
      continue;
    }

    const locationName = LOCATION_NAMES[location];
    const bookUrl = BOOKING_URLS[location];
    const content = makeContent(location, path, bookUrl, locationName);

    if (!content) {
      console.error(`No content generated for ${location}/${path}`);
      failed++;
      continue;
    }

    row.set('section1', content);
    await row.save();
    console.log(`✅ Updated row ${rowIdx}: ${location}/${path} (${content.length} chars)`);
    updated++;

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
