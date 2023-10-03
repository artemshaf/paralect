import { FC, ReactElement } from 'react';
import {
  SimpleGrid,
  MediaQuery,
  Box,
  Title,
  Text,
  Avatar,
} from '@mantine/core';
import { IconBox } from '@tabler/icons-react';
import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}
    >
      <div className={classes.wrapper}>
        <main className={classes.content}>
          {children}
        </main>
      </div>
      <MediaQuery
        smallerThan="sm"
        styles={{ display: 'none' }}
      >
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box bg="#efefef" style={{ borderRadius: '12px' }}>
            <Box display="flex" p="lg" style={{ gap: 20, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Box style={{ alignSelf: 'flex-start', display: 'flex', gap: '20px' }}>
                <IconBox width={32} height={32} fill="#b0b0b0" />
                <Title order={3}>Shopy</Title>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <img
                  src="/paralect.png"
                  alt="design"
                  style={{ maxHeight: '500px', width: '100%', height: '100%', objectFit: 'fill' }}
                />
              </Box>
              <Box>
                <Title>Sell and buy products  super quickly</Title>
                <Text>Save your time, we take care of all the processing.</Text>
                <Box>
                  <Avatar.Group>
                    <Avatar radius="xl" />
                    <Avatar radius="xl" />
                    <Avatar radius="xl" />
                  </Avatar.Group>
                  <Text>+27842 users from all over the world.</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </MediaQuery>
    </SimpleGrid>
  );
};

export default UnauthorizedLayout;
