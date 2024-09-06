import React from 'react';
import { Helmet } from 'react-helmet-async';


const Title = ({title = "Chat mate" , discription = "are yaar" }) => {
  return (  <Helmet>
      <title>{title}</title>
      <meta name="description" content={discription} />
    </Helmet>
  );
};

export default Title;
