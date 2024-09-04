import * as React from 'react';
import axios from "axios";
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';

import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import DashboardIcon from '@mui/icons-material/Dashboard';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import LayersIcon from '@mui/icons-material/Layers';
// import AssignmentIcon from '@mui/icons-material/Assignment';


import Tutorial from '../tutorial/Tutorial';
import Chart1 from '../chart/Chart1';
import Grid1 from '../grid/Grid1';



const baseURL = "./menu.json";

// export default function App() {
  


var icons = {
  People: <PeopleIcon />,
  DnsRounded: <DnsRoundedIcon />,
  PermMediaOutlined: <PermMediaOutlinedIcon />,
  Public: <PublicIcon />,
  SettingsEthernet: <SettingsEthernetIcon />,
  SettingsInputComponent: <SettingsInputComponentIcon />,
  Settings: <SettingsIcon />,
  Timer: <TimerIcon />,
  PhonelinkSetup: <PhonelinkSetupIcon />
};

var components = {
  authentication: <Tutorial />,
  database: <Chart1 />,
  storage: <Grid1 />
};


// var categories = [
//   {
//     id: 100,
//     text: 'Build',
//     children: [
//       {
//         id: 101, text: 'Authentication',
//         icon: "People",
//         active: true,
//       },
//       { id: 102, text: 'Database', icon: "DnsRounded" },
//       { id: 103, text: 'Storage', icon: "PermMediaOutlined" },
//       { id: 104, text: 'Hosting', icon: "Public" },
//       { id: 105, text: 'Functions', icon: "SettingsEthernet" },
//       {
//         id: 106, text: 'Machine learning',
//         icon: "SettingsInputComponent",
//       },
//     ],
//   },
//   {
//     id: 200, text: 'Quality',
//     children: [
//       { id: 201, text: 'Analytics', icon: "Settings" },
//       { id: 202, text: 'Performance', icon: "Timer" },
//       { id: 203, text: 'Test Lab', icon: "PhonelinkSetup" },
//     ],
//   },
// ];

// categories = [{}];

let categories = [
  {
    id: "",
    text: '',
    icon:"",
    children:[]
  }
];

export default function Navigator2(props) {
  const [menu, setMenu] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      // categories = JSON.stringify(response.data);
      categories = response.data;
      // let data = JSON.parse(response.data);
      console.log("m: " + response.data);
      setMenu(response.data);
      // console.log("menu: " + data);
      // categories = menu;
    });
  }, []);
  
  return (
    <List component="nav">
      {categories.map(({ id, text, icon, children }) => (
        <Box key={id}>
          <ListItem>
            <ListItemIcon>{icons[icon]}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
          </ListItem>
          {children.map(({ id: childId, text: childText, icon: childIcon, active }) => (
            <ListItem disablePadding key={childId}
              id={childId}
              onClick={(event) => {
                let _id = event.currentTarget.id;
                console.log(_id);
                props.setCurrentModule(components[_id]);
              }}
              >
              <ListItemButton selected={active}>
                <ListItemIcon>{icons[childIcon]}</ListItemIcon>
                <ListItemText>{childText}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </Box>
      ))}
      <Divider sx={{ my: 1 }} />
    </List>
  );
}
