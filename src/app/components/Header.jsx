const navList = [
  {
    id: 1,
    nav: "ATTRACTIONS",
  },
  {
    id: 2,
    nav: "PROGRAMS",
  },
  {
    id: 3,
    nav: "BIRTHDAY PARTIES",
  },
  {
    id: 4,
    nav: "GROUPS & EVENTS",
  },
  {
    id: 5,
    nav: "ABOUT US",
  },
  {
    id: 6,
    nav: "PRICING+PROMOS",
  },
  {
    id: 7,
    nav: "MEMBERSHIPS",
  },
];

const Header = () => {
  return (
    <ul className="navlist-wrapper">
      {navList &&
        navList.map((item) => {
          return <li key={item.id}>{item.nav}</li>;
        })}
    </ul>
  );
};

export default Header;
