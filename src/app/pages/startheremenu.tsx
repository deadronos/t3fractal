import type { ReactElement } from "react";
import {Flex, Grid, Button} from "@radix-ui/themes";

export default function StartHereMenu():ReactElement{
    return(
        <Flex>
            <Grid columns="3" width="100%" gap="3">
                <Button variant="solid" style={{ cursor: 'pointer' }}>Start Game</Button>
                <Button variant="soft" style={{ cursor: 'pointer' }}>Settings</Button>
                <Button variant="outline" style={{ cursor: 'pointer' }}>About</Button>
            </Grid>
        </Flex>
    );
}
