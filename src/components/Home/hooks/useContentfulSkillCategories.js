import { useStaticQuery, graphql } from "gatsby";

const ALL_CONTENTFUL_SKILL_CATEGORIES = graphql`
  query ContentfulSkillCategories {
    allContentfulSkillCategories {
      nodes {
        name
      }
    }
  }
`;

const useContentfulSkillCategories = () => {
  const data = useStaticQuery(ALL_CONTENTFUL_SKILL_CATEGORIES);

  return data?.allContentfulSkillCategories?.nodes;
};

export default useContentfulSkillCategories;
