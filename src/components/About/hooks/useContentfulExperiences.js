import { useStaticQuery, graphql } from "gatsby";

const ALL_CONTENTFUL_EXPERIENCES = graphql`
  query ContentfulExperiences {
    allContentfulExperiences {
      nodes {
        title
        type {
          name
        }
        organization
        startDate
        endDate
        description {
          raw
        }
      }
    }
  }
`;

const useContentfulExperiences = () => {
  const data = useStaticQuery(ALL_CONTENTFUL_EXPERIENCES);

  return data?.allContentfulExperiences?.nodes;
};

export default useContentfulExperiences;
