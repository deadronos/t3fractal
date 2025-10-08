import type { ReactElement } from "react";
import {Flex,Grid,Text} from "@radix-ui/themes";

export default function StartHereMenu():ReactElement{
    return(
        <Flex>
            <Grid columns="3" width="100%">
                <Text>Menu1</Text>
                <Text>Menu2</Text>
                <Text>Menu3</Text>
            </Grid>
        </Flex>
    );
}