import React from 'react';
import { Box } from '@mui/material';

import WelcomeOnboard from '@/components/WelcomeOnboard';

import useRouteStore from '@/store/routeStore';

const env = import.meta.env;

export default function onboard(props) {
  const [openModalAgree, setOpenModalAgree] = React.useState(false);
  const [openFloating, setOpenFloating] = React.useState(false);
  const route = useRouteStore((state) => state);

  return (
    <Box backgroundColor={'#FFBF00'}>
      <WelcomeOnboard
        setOpenModalAgree={setOpenModalAgree}
        setOpenFloating={setOpenFloating}
        setCloseCall={props.props.setCloseCall}
        openCall={() => route.push('call')}
      />
    </Box>
  );
}

const color = {
  textTitle: '#fff',
  main: env.VITE_APP_MAIN_COLOR,
  secondary: env.VITE_APP_SECONDARY_COLOR,
};

const styling = {
  TextField: {
    '& label.Mui-focused': {
      color: color.primary,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: color.primary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: color.main,
      },
      '&:hover fieldset': {
        borderColor: color.primary,
      },
      '&.Mui-focused fieldset': {
        borderColor: color.primary,
      },
    },
  },
  Checkbox: {
    color: color.main,
    '&.Mui-checked': {
      color: color.main,
    },
  },
  LabelCheckBox: {
    color: color.secondary,
    cursor: 'pointer',
    fontSize: '14px',
  },
};
