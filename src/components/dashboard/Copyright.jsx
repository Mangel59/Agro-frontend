import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import {SiteProps} from './SiteProps';

export default function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://www.usco.edu.co/">
          {SiteProps.appName}
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }