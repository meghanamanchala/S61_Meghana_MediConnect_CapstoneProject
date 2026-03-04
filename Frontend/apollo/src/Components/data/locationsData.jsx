import ahmedabad from '../assets/locations/ahmedabad.jpg'
import bangalore from '../assets/locations/bangalore.jpg'
import chennai from '../assets/locations/chennai.jpg'
import delhi from '../assets/locations/delhi.jpg'
import hyderabad from '../assets/locations/hyderabad.jpg'
import kolkata from '../assets/locations/kolkata.jpg'
import lucknow from '../assets/locations/lucknow.jpg'
import mumbai from '../assets/locations/mumbai.jpg'
import ahmedabadIcon from '../assets/common/ahmedabad_city.svg'
import bangaloreIcon from '../assets/common/bangalore_city.svg'
import chennaiIcon from '../assets/common/chennai_city.svg'
import delhiIcon from '../assets/common/delhi_city.svg'
import hyderabadIcon from '../assets/common/hyderabad_city.svg'
import kolkataIcon from '../assets/common/kolkata_city.svg'
import mumbaiIcon from '../assets/common/mumbai_city.svg'
import lucknowIcon from '../assets/common/lucknow_city.svg'
import defaultLocationIcon from '../assets/common/rourkela-main.svg'

const locationsData = [
  { name: "Delhi", address: "Apollo Centre, New Delhi", phoneNumber: "+91 2345678901", image: delhi },
  { name: "Mumbai", address: "Apollo Care, Mumbai", phoneNumber: "+91 8901234567", image: mumbai },
  { name: "Bangalore", address: "Apollo Health Hub, Bangalore", phoneNumber: "+91 4567890123", image: bangalore },
  { name: "Chennai", address: "Apollo Main Campus, Chennai", phoneNumber: "+91 1234509876", image: chennai },
  { name: "Hyderabad", address: "Apollo Med Center, Hyderabad", phoneNumber: "+91 8765432109", image: hyderabad },
  { name: "Kolkata", address: "Apollo Clinic, Kolkata", phoneNumber: "+91 4567890123", image: kolkata },
  { name: "Ahmedabad", address: "Apollo Specialty, Ahmedabad", phoneNumber: "+91 1234567890", image: ahmedabad },
  { name: "Lucknow", address: "Apollo Health Point, Lucknow", phoneNumber: "+91 6789012345", image: lucknow }
];

const locationIcons = {
  Delhi: delhiIcon,
  Mumbai: mumbaiIcon,
  Bangalore: bangaloreIcon,
  Chennai: chennaiIcon,
  Hyderabad: hyderabadIcon,
  Kolkata: kolkataIcon,
  Ahmedabad: ahmedabadIcon,
  Lucknow: lucknowIcon,
};

const locationsDataWithIcons = locationsData.map((location) => ({
  ...location,
  icon: locationIcons[location.name] || defaultLocationIcon
}));

export default locationsDataWithIcons;
