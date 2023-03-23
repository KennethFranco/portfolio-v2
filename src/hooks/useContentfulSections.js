import { useStaticQuery, graphql } from "gatsby";

const ALL_CONTENTFUL_SECTIONS = graphql`
  query ContentfulSections {
    allContentfulSections {
      nodes {
        name
        header
        body {
          raw
        }
      }
    }
  }
`;

const useContentfulSections = () => {
  const data = useStaticQuery(ALL_CONTENTFUL_SECTIONS);

  return data?.allContentfulSections?.nodes;
};

export default useContentfulSections;
