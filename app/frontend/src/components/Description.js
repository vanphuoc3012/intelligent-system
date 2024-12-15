import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionItem from './DescriptionItem';

const Description = () => {
  const theme = useTheme();
  
  return (
    <Box
      maxWidth={{ sm: 960, md: 1440 }}
      width={1}
      margin='0 auto'
      paddingTop={2}
      paddingBottom={2}
    >
      <Box
        data-aos='fade-up'
        backgroundColor={theme.palette.background.default}
        paddingTop={4}
      >
        <Container
          maxWidth='lg'
          display='flex'
          sx={{
            alignItems: 'center',
            flexDirection: 'column',
            px: {
              md: '10px !important'
            }
          }}
        >
          <Typography
            data-aos='fade-up'
            align='center'
            color={theme.palette.text.primary}
            variant='h1'
            marginTop='30px'
          >
            How Does It Work?
          </Typography>
          <Typography
            data-aos='fade-up'
            align='center'
            color={theme.palette.text.secondary}
            variant='h4'
            paddingTop={3}
            paddingBottom={3}
            marginBottom='15px'
          >
            A step-by-step guide on how to use the app
          </Typography>
          <Stack spacing={4} direction="row" data-aos='fade-up' justifyContent="center" flexWrap="nowrap" marginLeft={'50px'} >
            <Box flexBasis="30%" display="flex" alignItems="center" justifyContent="center" height="200px">
              <DescriptionItem 
                icon={<EditIcon style={{ height: 25, width: 25 }} />}
                title='Enter Customer Information'
                subtitle='Enter the customer information, such as name, address, and contact information.'
              />
            </Box>
            <Box flexBasis="30%" display="flex" alignItems="center" justifyContent="center" height="200px">
              <DescriptionItem 
                icon={<AssessmentIcon style={{ height: 25, width: 25 }} />}
                title='Predict Customer Intent'
                subtitle='The system will predict the customer intent based on the information you entered.'
              />
            </Box>
            <Box flexBasis="30%" display="flex" alignItems="center" justifyContent="center" height="200px">
              <DescriptionItem 
                icon={<VisibilityIcon style={{ height: 25, width: 25 }} />}
                title='View The Result and Evaluate Customer Intent'
                subtitle='Evaluate the customer intent and determine if the customer is eligible for a loan.'
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Description;