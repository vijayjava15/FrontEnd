

import React from 'react'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LaptopIcon from '@mui/icons-material/Laptop';
import Stopwatch from './Stopwatch';

const SideBarData  = [ 

    {name:'Task Planner',
        icon: <CalendarTodayIcon/>,
        url : '/taskPlanner'
    }, 
     { name:'Course ',
        icon: <LaptopIcon />, 
        url : '/Course'
    },
    { name:'Deployment ',
        icon: <LaptopIcon />, 
        url : '/deployment'
    },
    { name:'Video Download ',
        icon: <LaptopIcon />, 
        url : '/download'
    },
    { name:'Quiz App ',
        icon: <LaptopIcon />, 
        url : '/quiz'
    },
    { name:'Stopwatch ',
        icon: <LaptopIcon />, 
        url : '/stopwatch'
    }
]

export default SideBarData
