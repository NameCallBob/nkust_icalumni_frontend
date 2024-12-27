import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>智慧商務系 | 系友會｜{title} | 友會</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content="智慧商務系友會" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta charSet="utf-8" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};

export default SEO;
