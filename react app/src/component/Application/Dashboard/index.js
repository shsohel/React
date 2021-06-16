import CmtImage from '@coremat/CmtImage';
import { Box, Grid, Typography } from '@material-ui/core';
import GridContainer from 'containers/GridContainer';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios, { urls } from 'services/auth/jwt/config';
const logoUrl = '/images/erlLogo.jpg';
const imageDataType = 'data:image/png;base64';

export default function Dashboard() {
  const { authUser } = useSelector(({ auth }) => auth);
  const [customerImage, setCustomerImage] = useState(null);

  const getCustomerImageById = async () => {
    if (authUser) {
      await axios.get(`${urls.customer.get_customer_by_Id}/${authUser.companyId}`).then(({ data }) => {
        const body = data.data;
        setCustomerImage(body);
      });
    } else {
      setCustomerImage(null);
    }
  };

  useEffect(() => {
    document.title = 'ERL-BDMS - Dashboard';
    getCustomerImageById();
  }, [authUser]);
  return (
    <>
      <PageContainer>
        <GridContainer>
          <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
            <Box>
              <Box display="flex" justifyContent="center" m={1} p={1}>
                <Typography variant="h1">
                  {customerImage !== null ? `${customerImage.nameEN}` : 'Eastern Refinery Limited'}
                </Typography>
              </Box>
              <Box>
                <CmtImage
                  style={{ height: '500px', margin: '5px', opacity: '0.5' }}
                  src={customerImage !== null ? `${imageDataType},${customerImage.logo}` : `${logoUrl}`}
                />
              </Box>
            </Box>
          </Grid>
        </GridContainer>
      </PageContainer>
    </>
  );
}
