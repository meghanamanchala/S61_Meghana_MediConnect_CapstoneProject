import ahmedabad from '../assests2/ahmedabad.jpg'
import aragonda from '../assests2/aragonda.jpg'
import bangalore from '../assests2/bangalore.jpg'
import bhopal from '../assests2/bhopal.jpg'
import bhubaneswar from '../assests2/bhubaneswar.jpg'
import bilaspur from '../assests2/bilaspur.jpg'
import chennai from '../assests2/chennai.jpg'
import delhi from '../assests2/delhi.jpg'
import guwahati from '../assests2/guwahati.jpg'
import hyderabad from '../assests2/hyderabad.jpg'
import indore from '../assests2/indore.jpg'
import kakinada from '../assests2/kakinada.jpg'
import karur from '../assests2/karur.jpg'
import kochi from '../assests2/kochi.jpg'
import kolkata from '../assests2/kolkata.jpg'
import lucknow from '../assests2/lucknow.jpg'
import madurai from '../assests2/madurai.jpg'
import mumbai from '../assests2/mumbai.jpg'
import mysore from '../assests2/mysore.jpg'
import nashik from '../assests2/nashik.jpg'
import nellore from '../assests2/nellore.webp'
import noida from '../assests2/noida.jpg'
import rourkela from '../assests2/rourkela.jpg'
import trichy from '../assests2/trichy.jpg'
import visakhapatnam from '../assests2/visakhapatnam.jpg'
import ahmedabadIcon from '../assests/ahmedabad_city.svg'
import bangaloreIcon from '../assests/bangalore_city.svg'
import bhubaneshwarIcon from '../assests/bhubaneshwar_city.svg'
import chennaiIcon from '../assests/chennai_city.svg'
import delhiIcon from '../assests/delhi_city.svg'
import guwahatiIcon from '../assests/guwahati_city.svg'
import hyderabadIcon from '../assests/hyderabad_city.svg'
import indoreIcon from '../assests/indore_city.svg'
import kakinadaIcon from '../assests/kakinada_city.svg'
import kolkataIcon from '../assests/kolkata_city.svg'
import maduraiIcon from '../assests/madurai_city.svg'
import mumbaiIcon from '../assests/mumbai_city.svg'
import mysoreIcon from '../assests/mysore_city.svg'
import nashikIcon from '../assests/nashik_city.svg'
import lucknowIcon from '../assests/lucknow_city.svg'
import defaultLocationIcon from '../assests/rourkela-main.svg'

const locationsData = [
  { name: "Ahmedabad", address: "123 Street, Ahmedabad", phoneNumber: "+91 1234567890", image: ahmedabad },
  { name: "Aragonda", address: "456 Street, Aragonda", phoneNumber: "+91 9876543210", image: aragonda },
  { name: "Bangalore", address: "789 Street, Bangalore", phoneNumber: "+91 4567890123", image: bangalore },
  { name: "Bhubaneshwar", address: "ABC Street, Bhubaneshwar", phoneNumber: "+91 7890123456", image: bhubaneswar },
  { name: "Bilaspur", address: "123 Street,Bilaspur", phoneNumber: "+91 1345666666", image: bilaspur },
  { name: "Bhopal", address: "XYZ Street, Bhopal", phoneNumber: "+91 9876543210", image: bhopal },
  { name: "Chennai", address: "LMN Street, Chennai", phoneNumber: "+91 1234509876", image: chennai },
  { name: "Delhi", address: "PQR Street, Delhi", phoneNumber: "+91 2345678901", image: delhi },
  { name: "Guwahati", address: "DEF Street, Guwahati", phoneNumber: "+91 9876543210", image: guwahati },
  { name: "Hyderabad", address: "GHI Street, Hyderabad", phoneNumber: "+91 8765432109", image: hyderabad },
  { name: "Indore", address: "JKL Street, Indore", phoneNumber: "+91 9876543210", image: indore },
  { name: "Kakinada", address: "MNO Street, Kakinada", phoneNumber: "+91 2345678901", image: kakinada },
  { name: "Karur", address: "STU Street, Karur", phoneNumber: "+91 3456789012", image: karur },
  { name: "Kochi", address: "YZA Street, Kochi", phoneNumber: "+91 5678901234", image: kochi },
  { name: "Kolkata", address: "VWX Street, Kolkata", phoneNumber: "+91 4567890123", image: kolkata },
  { name: "Lucknow", address: "BCD Street, Lucknow", phoneNumber: "+91 6789012345", image: lucknow },
  { name: "Madhurai", address: "EFG Street, Madhurai", phoneNumber: "+91 7890123456", image: madurai },
  { name: "Mumbai", address: "HIJ Street, Mumbai", phoneNumber: "+91 8901234567", image: mumbai },
  { name: "Mysore", address: "OPQ Street, Mysore", phoneNumber: "+91 9012345678", image: mysore },
  { name: "Nashik", address: "RST Street, Nashik", phoneNumber: "+91 0123456789", image: nashik },
  { name: "Nellore", address: "UVW Street, Nellore", phoneNumber: "+91 1234567890", image: nellore },
  { name: "Noida", address: "XYZ Street, Noida", phoneNumber: "+91 2345678901", image: noida },
  { name: "Rourkela", address: "ABC Street, Rourkela", phoneNumber: "+91 3456789012", image: rourkela },
  { name: "Trichy", address: "EFG Street, Trichy", phoneNumber: "+91 4567890123", image: trichy },
  { name: "Visakhapatnam", address: "HIJ Street, Visakhapatnam", phoneNumber: "+91 5678901234", image: visakhapatnam }
];

const locationIcons = {
  Ahmedabad: ahmedabadIcon,
  Bangalore: bangaloreIcon,
  Bhubaneshwar: bhubaneshwarIcon,
  Chennai: chennaiIcon,
  Delhi: delhiIcon,
  Guwahati: guwahatiIcon,
  Hyderabad: hyderabadIcon,
  Indore: indoreIcon,
  Kakinada: kakinadaIcon,
  Kolkata: kolkataIcon,
  Lucknow: lucknowIcon,
  Madhurai: maduraiIcon,
  Mumbai: mumbaiIcon,
  Mysore: mysoreIcon,
  Nashik: nashikIcon
};

const locationsDataWithIcons = locationsData.map((location) => ({
  ...location,
  icon: locationIcons[location.name] || defaultLocationIcon
}));

export default locationsDataWithIcons;
