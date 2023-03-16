import { useStaticQuery, graphql } from "gatsby";

const ALL_CONTENTFUL_SKILLS = graphql`
  query ContentfulSkills {
    allContentfulSkills {
      nodes {
        name
        category {
          name
        }
      }
    }
  }
`;

const useContentfulSkills = () => {
  const data = useStaticQuery(ALL_CONTENTFUL_SKILLS);

  return data?.allContentfulSkills?.nodes;
};

export default useContentfulSkills;
