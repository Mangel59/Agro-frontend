import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Toolbar, IconButton } from '@mui/material';
import { Drawer } from './Drawer';
import Navigator2 from './Navigator2';
import { useThemeToggle } from './ThemeToggleProvider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function Contenido(props) {
    const [currentModuleItem, setCurrentModuleItem] = React.useState();
    const [open, setOpen] = React.useState(false);
    const toggleTheme = useThemeToggle();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Drawer variant="temporary" open={open} onClose={toggleDrawer} sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Navigator2 setCurrentModuleItem={setCurrentModuleItem} />
            </Drawer>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ flexGrow: 1 }}>
                <Grid item xs={12} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Drawer variant="permanent" open={true}>
                        <Navigator2 setCurrentModuleItem={setCurrentModuleItem} />
                    </Drawer>
                </Grid>
                <Grid item xs={12} sm={10}>
                    {currentModuleItem}
                </Grid>
            </Grid>
        </Box>
    );
}
