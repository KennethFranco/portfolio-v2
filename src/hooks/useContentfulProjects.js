import { useStaticQuery, graphql } from "gatsby";

const ALL_CONTENTFUL_PROJECTS = graphql`
  query ContentfulProjects {
    allContentfulProjects {
      nodes {
        name
        link
        startDate
        endDate
        skills {
          name
        }
        hero {
          file {
            url
          }
          gatsbyImage(layout: FULL_WIDTH, placeholder: BLURRED, width: 1425)
          resize(height: 566, width: 1425) {
            src
          }
        }
        description {
          description
        }
        isFeatured
      }
    }
  }
`;

const useContentfulProjects = () => {
  const data = useStaticQuery(ALL_CONTENTFUL_PROJECTS);

  return data?.allContentfulProjects?.nodes;
};

export default useContentfulProjects;
