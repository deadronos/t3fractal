import type {ReactElement} from "react";
import StartHereMenu from "./startheremenu";
import { Box } from "@radix-ui/themes";


export default function StartHere():ReactElement {
    return(
        <Box
            className="startherebox"
        >
            <StartHereMenu />
            <div>
                Test
            </div>
        </Box>
    );
}