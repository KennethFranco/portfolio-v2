import { useStaticQuery, graphql } from "gatsby";

const ALL_CONTENTFUL_HERO = graphql`
  query ContentfulHero {
    allContentfulHero {
      nodes {
        name
        header
        subheader
        subheader2
        body {
          raw
        }
        heroImage {
          file {
            url
          }
        }
        hasExtraElements
      }
    }
  }
`;

const useContentfulHero = () => {
  const data = useStaticQuery(ALL_CONTENTFUL_HERO);

  return data?.allContentfulHero?.nodes;
};

export default useContentfulHero;
