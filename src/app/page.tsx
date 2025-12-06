import {GlobalProvider} from "@/app/providers/provider"
// import T3StarterPage from "@/app/t3starterpage";
import StartHere from "@/app/pages/starthere"
import {Theme} from "@radix-ui/themes"

/**
 * The home page of the application.
 * Renders the game wrapper with themes and providers.
 *
 * @returns The home page component.
 */
export default function HomePage() {
  return (
    <GlobalProvider>
      <Theme
        hasBackground={true}
        accentColor="mint"
	      grayColor="gray"
	      panelBackground="solid"
	      scaling="100%"
	      radius="full"
      >
        <StartHere />
      </Theme>
    </GlobalProvider>
  );
}
