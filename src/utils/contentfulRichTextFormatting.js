import React from "react";
import { Link } from "gatsby";

import { BLOCKS } from "@contentful/rich-text-types";
import { INLINES } from "@contentful/rich-text-types";
import { MARKS } from "@contentful/rich-text-types";

export const contentfulOptions = {
  renderMark: {
    [MARKS.ITALIC]: (text) => {
      return (
        <span className="text-red3 font-bold text-center mr-4">{text}</span>
      );
    },
  },
  renderNode: {
    [BLOCKS.UL_LIST]: (node, children) => {
      return <ul className="list-disc ml-4">{children}</ul>;
    },
    [BLOCKS.OL_LIST]: (node, children) => {
      return <ol className="list-decimal ml-4">{children}</ol>;
    },
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <Link
          to={`${node?.data?.uri}`}
          className="text-red3 font-extrabold hover:text-red2 duration-150 ease-in"
        >
          {children}
        </Link>
      );
    },
  },
};
