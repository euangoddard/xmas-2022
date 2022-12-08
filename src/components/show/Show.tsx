import type { ComponentChild, FunctionalComponent } from "preact";

interface ShowProps {
  when: boolean;
  fallback?: ComponentChild;
}

export const Show: FunctionalComponent<ShowProps> = ({
  when,
  fallback = undefined,
  children,
}) => {
  return <>{when ? children : fallback}</>;
};
