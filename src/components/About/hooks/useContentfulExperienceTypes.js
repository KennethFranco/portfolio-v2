import { useStaticQuery, graphql } from "gatsby";

const ALL_CONTENTFUL_EXPERIENCE_TYPES = graphql`
  query ContentfulExperienceTypes {
    allContentfulExperienceTypes {
      nodes {
        name
        message {
          message
        }
        orderOnWebsite
      }
    }
  }
`;

const useContentfulExperienceTypes = () => {
  const data = useStaticQuery(ALL_CONTENTFUL_EXPERIENCE_TYPES);

  return data?.allContentfulExperienceTypes?.nodes;
};

export default useContentfulExperienceTypes;
