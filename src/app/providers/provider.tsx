/**
 * Global React Provider wrapper.
 * Currently a pass-through, but useful for future context providers.
 *
 * @param props - Component props.
 * @param props.children - Child components to render.
 * @returns The children wrapped in providers.
 */
export function GlobalProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return children;
}
