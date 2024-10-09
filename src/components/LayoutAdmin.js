import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { MdOutlineDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { MdSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { BsPeopleFill } from "react-icons/bs";
import { TbTransactionDollar } from "react-icons/tb";
import { RiLogoutBoxRFill } from "react-icons/ri";
import Cookie from 'js-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constant/keyStore';


const drawerWidth = 350;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

function LayoutAdmin({ children, title }) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const [paths, setPaths] = React.useState([]);

    const handleLogout = () => {
        Cookie.remove(ACCESS_TOKEN);
        Cookie.remove(REFRESH_TOKEN);
    };

    React.useEffect(() => {
        if (router.isReady) {
            const cleanPath = router.asPath.split('?')[0];
            const pathSegments = cleanPath.split('/').slice(2);
            const firstPath = pathSegments[0] ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1) : '';


            const newPaths = pathSegments
                .filter(p => p)
                .map(p => p)
                .splice(1);

            setPaths([firstPath, ...newPaths]);
        }
    }, [router.asPath, router.isReady]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const menuItems = [
        [
            { text: 'Dashboard', icon: <MdOutlineDashboard />, href: '/admin/dashboard' },
            { text: 'Profile', icon: <CgProfile />, href: '/admin/profile' },
            { text: 'Informasi Cakupan Wilayah', icon: <GrMapLocation />, href: '/admin/wilayah' },
        ],
        [
            { text: 'Daftar Layanan', icon: <MdSignalWifiStatusbarConnectedNoInternet4 />, href: '/admin/layanan' },
            { text: 'Daftar Pengguna', icon: <BsPeopleFill />, href: '/admin/pengguna' },
        ],
        [
            { text: 'Riwayat Transaksi', icon: <TbTransactionDollar />, href: '/admin/transaksi' },
        ],
        [
            { text: 'Keluar', icon: <RiLogoutBoxRFill />, href: '/admin/logout' },
        ],
    ];


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} color='default'>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {paths.map((path, index) => (
                            <Link key={index} href={`/admin/${paths.slice(0, index + 1).join('/').toLowerCase()}`}>{path} {index !== paths.length - 1 ? <ChevronRightIcon /> : ' '}</Link>
                        ))}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open} >
                <DrawerHeader className='w-full flex flex-row items-center justify-normal' >
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h6" color='black' fontWeight={700} className='text-start'>AbuNet</Typography>
                </DrawerHeader>
                <Divider />
                {menuItems.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                        <List>
                            {group.map((item, index) => (
                                <Link key={item.text} href={item.href} prefetch={false} onClick={() => {
                                    item.href === '/admin/logout' ? handleLogout()
                                        : null
                                }}>
                                    <ListItem disablePadding sx={{ display: 'block' }}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: open ? 3 : 'auto',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.text}
                                                sx={{ opacity: open ? 1 : 0 }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            ))}
                        </List>
                        {groupIndex < menuItems.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }} className='min-h-screen'>
                <DrawerHeader />
                <Typography variant="h4" color='black' fontWeight={700} className='mb-4'>
                    {title}
                </Typography>
                {children}
            </Box>
        </Box>
    );
}

export default LayoutAdmin;
