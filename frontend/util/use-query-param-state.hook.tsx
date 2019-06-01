import React from "react";
import queryString from "query-string";
import { identity } from "lodash-es";

export function useQueryParamState(
  name,
  initialValue = "",
  transformer = identity
) {
  const [value, setValue] = React.useState(
    () => queryString.parse(window.location.search)[name] || initialValue
  );

  React.useEffect(() => {
    const query = queryString.parse(window.location.search);
    // @ts-ignore
    query[name] = value;
    window.history.replaceState(
      history.state,
      document.title,
      location.pathname + "?" + queryString.stringify(query)
    );
  }, [value]);

  return [transformer(value), setValue];
}
