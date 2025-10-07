import {GlobalProvider} from "@/app/providers/provider"
// import T3StarterPage from "@/app/t3starterpage";
import StartHere from "@/app/pages/starthere"

export default function HomePage() {
  return (
    <GlobalProvider>
      <StartHere></StartHere>
    </GlobalProvider>
  );
}
